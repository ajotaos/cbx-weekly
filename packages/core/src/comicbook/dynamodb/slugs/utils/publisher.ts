export function makePublisherNameSlug(string: string) {
	return string
		.toString()
		.normalize('NFD')
		.toLowerCase()
		.replace(/\s*[^a-z0-9-]+\s*/g, '-')
		.replace(/(?:^-)|(?:-$)/g, '');
}
