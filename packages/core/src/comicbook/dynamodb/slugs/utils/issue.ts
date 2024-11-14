export function makeIssueNumberSlug(string: string) {
	const parts = string
		.toString()
		.normalize('NFD')
		.toLowerCase()
		.replace(/\./g, '-')
		.split('-') as [string, ...Array<string>];

	return parts.with(0, parts[0].padStart(4, '0')).join('-');
}
