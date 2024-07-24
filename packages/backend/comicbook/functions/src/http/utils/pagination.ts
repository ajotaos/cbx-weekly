import {
	createSignedMessage,
	extractSignedData,
} from '@cbx-weekly/backend-core-crypto';

import { UnprocessableEntity } from 'http-errors';

export function createSignedPaginationCursor(
	cursor: string | undefined,
	secret: string,
) {
	return mapIfDefined(cursor, (cursor) => createSignedMessage(cursor, secret));
}

export function extractSignedPaginationCursor(
	cursor: string | undefined,
	secret: string,
) {
	return mapIfDefined(cursor, (cursor) => {
		const extraction = extractSignedData(cursor, secret);

		if (!extraction.verified) {
			throw new UnprocessableEntity();
		}

		return extraction.data;
	});
}

function mapIfDefined<T, U>(
	value: T | undefined,
	fn: (value: T) => U,
): U | undefined {
	return value !== undefined ? fn(value) : undefined;
}
