export function prefixComponentNameFactory(prefix: string) {
	return (name: string) => `${prefix}${name}`;
}
