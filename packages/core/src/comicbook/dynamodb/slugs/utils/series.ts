export function makeSeriesNameSlug(string: string) {
	return string
		.toString()
		.normalize('NFD')
		.toLowerCase()
		.replace(/\s*[^a-z0-9-]+\s*/g, '-')
		.replace(/(?:^-)|(?:-$)/g, '');
}
