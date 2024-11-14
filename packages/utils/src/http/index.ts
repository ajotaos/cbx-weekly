import { signMessage, verifyMessage } from '../crypto/message';

import { UnprocessableEntity } from 'http-errors';

export namespace Http {
	export namespace PaginationCursor {
		export function makeUtils(secret: string) {
			return {
				sign(data: string) {
					return signMessage(data, secret);
				},
				verify(signed: string) {
					return (
						verifyMessage(signed, secret) ?? _throw(new UnprocessableEntity())
					);
				},
			} as const;
		}
	}
}

function _throw<TError extends Error>(error: TError): never {
	throw error;
}
