import type { NonEmptyTuple } from 'type-fest';

export function encodeBucketObjectKey(...parts: NonEmptyTuple<string>) {
	return parts.join('/');
}
