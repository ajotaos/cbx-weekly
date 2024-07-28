import {
	createSignedMessage,
	extractSignedData,
	isInvalidSignedMessageError,
} from '@cbx-weekly/backend-core-crypto';

import { UnprocessableEntity } from 'http-errors';

export function createSignedPaginationCursor(
	cursor: string | undefined,
	secret: string,
) {
	if (cursor === undefined) {
		return;
	}

	return createSignedMessage(cursor, secret);
}

export function extractSignedPaginationCursor(
	cursor: string | undefined,
	secret: string,
) {
	if (cursor === undefined) {
		return;
	}

	try {
		return extractSignedData(cursor, secret);
	} catch (error) {
		if (isInvalidSignedMessageError(error)) {
			throw new UnprocessableEntity();
		}

		throw error;
	}
}
