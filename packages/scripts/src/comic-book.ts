import { Resource } from 'sst';

import { Command } from 'commander';

import { Comicbook } from '@cbx-weekly/core/comicbook';

import { Files } from '@cbx-weekly/utils/files';

import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

import Axios from 'axios';

import { minutesToSeconds } from 'date-fns';

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { scheduler } from 'node:timers/promises';

import chalk from 'chalk';
import ora from 'ora';

const logger = {
	info: (message: string) => console.log(chalk.blue(`INFO: ${message}`)),
	success: (message: string) => console.log(chalk.green(`SUCCESS: ${message}`)),
	warn: (message: string) => console.warn(chalk.yellow(`WARNING: ${message}`)),
	error: (message: string) => console.error(chalk.red(`ERROR: ${message}`)),
};

// AWS Clients
const dynamodbClient = new DynamoDBClient();
const s3Client = new S3Client();

// Argument validation
const parseImportIssueCommandOptions = v.parser(
	v.strictObject({
		title: v.pipe(v.string(), v_comicbook.captureIssueTitleComponents()),
		releaseDate: v.pipe(v.string(), v.isoWeekDate()),
		pagesetFilePath: v.pipe(
			v.string(),
			v.transform((path) => resolve(path)),
		),
	}),
);

// Commander CLI Configuration
const program = new Command();

program
	.name('comic-book')
	.command('import-issue')
	.description('Imports a comic book issue and processes its pageset.')
	.requiredOption('--title <string>', 'The title of the comic book issue.')
	.requiredOption(
		'--release-date <string>',
		'The release date in ISO week date format (yyyy-Www-d).',
	)
	.requiredOption(
		'--pageset-file-path <string>',
		'The file path to the pageset ZIP file.',
	)
	.action(async (options) => {
		try {
			logger.info('Validating input arguments...');
			const parsed = parseImportIssueCommandOptions(options);

			const pagesetFile = await readFile(parsed.pagesetFilePath);
			await validateFileType(pagesetFile, new Set(['application/zip']));

			logger.info('Fetching or creating the comic book series...');
			const { item: series } = await Comicbook.Dynamodb.getSeriesByTitle(
				{
					title: {
						publisher: parsed.title.publisher,
						name: parsed.title.series,
					},
				},
				Resource.ComicbookDynamodbTable.name,
				dynamodbClient,
			);

			logger.info('Creating the comic book issue...');
			const { item: issue } = await Comicbook.Dynamodb.putIssue(
				{
					title: parsed.title,
					releaseDate: parsed.releaseDate,
					seriesId: series.id,
				},
				Resource.ComicbookDynamodbTable.name,
				dynamodbClient,
			);

			logger.info('Initializing the pageset...');
			const { item: pageset } = await Comicbook.Dynamodb.putPageset(
				{ issueId: issue.id },
				Resource.ComicbookDynamodbTable.name,
				dynamodbClient,
			);

			const upload = await Comicbook.S3.signPagesetUploadUrl(
				{ pagesetId: pageset.id, expiresIn: minutesToSeconds(3) },
				Resource.ComicbookS3Bucket.name,
				s3Client,
			);

			await Comicbook.Dynamodb.updatePagesetStatus(
				{
					id: pageset.id,
					status: 'pending',
					expiration: (currentTime) => currentTime + minutesToSeconds(3),
				},
				Resource.ComicbookDynamodbTable.name,
				dynamodbClient,
			);

			logger.info('Uploading the pageset file...');
			await Axios.put(upload.url, pagesetFile, {
				maxBodyLength: Number.POSITIVE_INFINITY,
				headers: { 'Content-Type': 'application/zip' },
			});

			logger.info('Monitoring the pageset processing status...');
			const spinner = ora({
				text: 'Checking pageset processing status...',
				color: 'blue',
			}).start();

			let status: Awaited<
				ReturnType<typeof Comicbook.Dynamodb.getPagesetById>
			>['item']['status'] = 'pending';
			let attempt = 0;
			const maxAttempts = 15;

			do {
				attempt++;
				spinner.text = `Checking pageset status (Attempt ${attempt}/${maxAttempts})...`;

				await scheduler.wait(10_000); // Wait 10 seconds between checks

				status = await Comicbook.Dynamodb.getPagesetById(
					{ id: pageset.id },
					Resource.ComicbookDynamodbTable.name,
					dynamodbClient,
				).then(({ item }) => item.status);
			} while (
				(status === 'pending' || status === 'processing') &&
				attempt < maxAttempts
			);

			spinner.stop();

			if (
				attempt >= maxAttempts &&
				(status === 'pending' || status === 'processing')
			) {
				logger.error(
					`Maximum attempts (${maxAttempts}) reached while checking pageset status. Pageset may not be processed yet.`,
				);
				process.exit(1);
			}

			if (status === 'failed') {
				logger.error(
					'Pageset processing failed. Please check the logs for details.',
				);
				process.exit(1);
			}

			logger.success('Pageset processed successfully. Linking to the issue...');
			await Comicbook.Dynamodb.updateIssuePagesetId(
				{ id: issue.id, pagesetId: pageset.id },
				Resource.ComicbookDynamodbTable.name,
				dynamodbClient,
			);

			logger.success('Comic book issue and pageset imported successfully!');
		} catch (error) {
			logger.error('An error occurred during the import process.');
			if (error instanceof Error) {
				logger.error(`Details: ${error.message}`);
			}
			process.exit(1);
		}
	});

program.parseAsync(process.argv);

async function validateFileType(
	data: Uint8Array,
	allowedFileTypes: Set<Awaited<ReturnType<typeof Files.getTypeFromData>>>,
): Promise<string> {
	const detectedFileType = await Files.getTypeFromData(data);

	if (!allowedFileTypes.has(detectedFileType)) {
		throw Files.Errors.unsupportedFileType.make(detectedFileType);
	}

	return detectedFileType;
}
