import { takeWhile } from 'es-toolkit';

export function makePartitionKey(type: string, ...parts: Array<string>) {
	return [type, ...parts, '#'].join(':');
}

export function makeSortKey(...parts: Array<string>) {
	return takeWhile([...parts, '#'], (part) => part !== '').join(':');
}
