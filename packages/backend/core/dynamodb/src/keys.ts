import { takeWhile } from 'es-toolkit';

export function makeTableItemPartitionKey(...parts: Array<string>) {
	return [...parts, '#'].join(':');
}

export function makeTableItemSortKey(...parts: Array<string>) {
	return takeWhile([...parts, '#'], (part) => part !== '').join(':');
}
