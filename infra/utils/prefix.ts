export function prefix(prefix: string) {
	return (string: string) => prefix + string;
}
