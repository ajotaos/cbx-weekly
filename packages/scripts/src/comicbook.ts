import { Resource } from 'sst';

import { Comicbook } from '@cbx-weekly/core/comicbook';

import { Files } from '@cbx-weekly/utils/files';

import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import Axios from 'Axios';

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { scheduler } from 'node:timers/promises';

import { Command } from 'commander';

import chalk from 'chalk';
import ora from 'ora';

const logger = {
	debug: (message: string) => console.debug(chalk.cyan(`DEBUG: ${message}`)),
	info: (message: string) => console.log(chalk.blue(`INFO: ${message}`)),
	success: (message: string) => console.log(chalk.green(`SUCCESS: ${message}`)),
	warn: (message: string) => console.warn(chalk.yellow(`WARNING: ${message}`)),
	error: (message: string) => console.error(chalk.red(`ERROR: ${message}`)),
};

const parseCreateIssueOptions = v.parser(
	v.pipe(
		v.strictObject({
			publisher: v.pipe(v.string(), v_comicbook.publisherName()),
			series: v.pipe(v.string(), v_comicbook.seriesName()),
			number: v.pipe(v.string(), v_comicbook.issueNumber()),
			releaseDate: v.pipe(v.string(), v.isoWeekDate()),
			pagesetFilePath: v.string(),
		}),
		v.transform((options) => ({
			title: {
				publisher: options.publisher,
				series: options.series,
				number: options.number,
			},
			releaseDate: options.releaseDate,
			pagesetFilePath: options.pagesetFilePath,
		})),
	),
);

// Commander CLI Configuration
const program = new Command();

program
	.command('create-issue')
	.version('1.0.0')
	.description('Create a comic book issue and process its pageset.')
	.requiredOption(
		'--publisher <string>',
		'The name of the comic book publisher.',
	)
	.requiredOption('--series <string>', 'The name of the comic book series.')
	.requiredOption('--number <string>', 'The number of the comic book issue.')
	.requiredOption(
		'--release-date <string>',
		'The release date of the comic book issue.',
	)
	.requiredOption(
		'--pageset-file-path <string>',
		'The path to the comic book pageset file.',
	)
	.action(async (rawCreateIssueOptions) => {
		try {
			logger.info('Validating input arguments...');
			const createIssueOptions = parseCreateIssueOptions(rawCreateIssueOptions);

			const pagesetFile = await readFile(
				resolve(createIssueOptions.pagesetFilePath),
			);
			await Files.validateFileType(pagesetFile, new Set(['application/zip']));

			logger.info('Fetching the comic book series...');
			const { result: series } = await Comicbook.Api.getSeriesByTitle(
				{
					title: {
						publisher: createIssueOptions.title.publisher,
						name: createIssueOptions.title.series,
					},
				},
				Resource.ComicbookHttpApi.url,
				Axios,
			);

			logger.info('Creating the comic book issue...');
			const { result: issue } = await Comicbook.Api.createIssue(
				{
					title: {
						publisher: createIssueOptions.title.publisher,
						series: createIssueOptions.title.series,
						number: createIssueOptions.title.number,
					},
					releaseDate: createIssueOptions.releaseDate,
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

			const maxAttempts = 30;

			let status: Comicbook.Api.Pageset['status'] = 'pending';
			let attempt = 0;

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

				logger.info('Attempting to delete the pageset...');
				await Comicbook.Api.deletePageset(
					{ id: pageset.id },
					Resource.ComicbookHttpApi.url,
					Axios,
				);
				process.exit(1);
			}

			if (status === 'failed') {
				logger.error(
					'Pageset processing failed. Please check the logs for details.',
				);

				logger.info('Attempting to delete the pageset...');
				await Comicbook.Api.deletePageset(
					{ id: pageset.id },
					Resource.ComicbookHttpApi.url,
					Axios,
				);
				process.exit(1);
			}

			logger.success('Pageset processed successfully. Linking to the issue...');
			await Comicbook.Api.updateIssuePagesetId(
				{ id: issue.id, pagesetId: pageset.id },
				Resource.ComicbookHttpApi.url,
				Axios,
			);

			logger.success('Comic book issue and pageset created successfully!');
		} catch (error) {
			logger.error('An error occurred during the creation process.');
			if (error instanceof Error) {
				logger.error(`Details: ${error.message}`);
			}
			process.exit(1);
		}
	});

program.parseAsync(process.argv);
