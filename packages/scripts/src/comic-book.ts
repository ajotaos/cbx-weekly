import { Resource } from 'sst';

import { Command } from 'commander';

import { Comicbook } from '@cbx-weekly/core/comicbook';

import { Files } from '@cbx-weekly/utils/files';

import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import Axios from 'Axios';

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

// Argument validation
const parseImportIssueCommandOptions = v.parser(
	v.strictObject({
		publisher: v.pipe(v.string(), v_comicbook.publisherName()),
		series: v.pipe(v.string(), v_comicbook.seriesName()),
		number: v.pipe(v.string(), v_comicbook.issueNumber()),
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
	.requiredOption(
		'--publisher <string>',
		'The name of the comic book publisher.',
	)
	.requiredOption('--series <string>', 'The name of the comic book series.')
	.requiredOption('--number <string>', 'The number of the comic book issue.')
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
			await Files.validateFileType(pagesetFile, new Set(['application/zip']));

			logger.info('Fetching or creating the comic book series...');
			const { result: series } = await Comicbook.Api.getSeriesByTitle(
				{
					title: {
						publisher: parsed.publisher,
						name: parsed.series,
					},
				},
				Resource.ComicbookHttpApi.url,
				Axios,
			);

			logger.info('Creating the comic book issue...');
			const { result: issue } = await Comicbook.Api.createIssue(
				{
					title: {
						publisher: parsed.publisher,
						series: parsed.series,
						number: parsed.number,
					},
					releaseDate: parsed.releaseDate,
					seriesId: series.id,
				},
				Resource.ComicbookHttpApi.url,
				Axios,
			);

			logger.info('Initializing the pageset...');
			const { result: pageset, upload } = await Comicbook.Api.createPageset(
				{ issueId: issue.id },
				Resource.ComicbookHttpApi.url,
				Axios,
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

				status = await Comicbook.Api.getPagesetById(
					{ id: pageset.id },
					Resource.ComicbookHttpApi.url,
					Axios,
				).then(({ result }) => result.status);
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
			await Comicbook.Api.updateIssuePagesetId(
				{ id: issue.id, pagesetId: pageset.id },
				Resource.ComicbookHttpApi.url,
				Axios,
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
