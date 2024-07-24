import { takeWhile } from 'es-toolkit';

import type { NonEmptyTuple } from 'type-fest';

export function encodeTableItemPartitionKey(...parts: NonEmptyTuple<string>) {
	return [...parts, '#'].join(':');
}

export function encodeTableItemSortKey(...parts: Array<string>) {
	return takeWhile([...parts, '#'], (part) => part !== '').join(':');
}
