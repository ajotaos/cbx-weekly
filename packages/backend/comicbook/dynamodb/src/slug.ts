import type { Issue, Publisher, Series } from './types';

export function slugifyPublisherTitle(title: Publisher.TableItem['title']) {
	return [slugifyPublisherName(title.name)].join('-');
}

export function slugifySeriesTitle(title: Series.TableItem['title']) {
	return [
		slugifyPublisherName(title.publisher),
		slugifySeriesName(title.name),
	].join('-');
}

export function slugifyIssueTitle(title: Issue.TableItem['title']) {
	return [
		slugifyPublisherName(title.publisher),
		slugifySeriesName(title.series),
		slugifyIssueNumber(title.number),
	].join('-');
}

function slugifyPublisherName(string: string) {
	return string
		.toString()
		.normalize('NFD')
		.toLowerCase()
		.replace(/\s*[^a-z0-9-]+\s*/g, '-')
		.replace(/(?:^-)|(?:-$)/g, '');
}

function slugifySeriesName(string: string) {
	return string
		.toString()
		.normalize('NFD')
		.toLowerCase()
		.replace(/\s*[^a-z0-9-]+\s*/g, '-')
		.replace(/(?:^-)|(?:-$)/g, '');
}

function slugifyIssueNumber(string: string) {
	const parts = string
		.toString()
		.normalize('NFD')
		.toLowerCase()
		.replace(/\./g, '-')
		.split('-') as [string, ...Array<string>];

	return parts.with(0, parts[0].padStart(4, '0'));
}
