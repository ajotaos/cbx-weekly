import type { NativeAttributeValue } from '@aws-sdk/lib-dynamodb';

export type Key = Record<string, NativeAttributeValue>;
export type Item = Record<string, NativeAttributeValue>;

export type ExpressionAttributes = {
	names: Record<string, string>;
	values: Record<string, NativeAttributeValue>;
};

export type Order = 'asc' | 'desc';
