import * as v from 'valibot';

import { omit } from 'es-toolkit';
import { deepCamelKeys } from 'string-ts';

import type { OverrideProperties, Simplify } from 'type-fest';

type RawTableItemPrimaryKey = {
	Pk: string;
	Sk: string;
};

type RawTableItemGsiKey<
	T extends number,
	TValue extends string | number | symbol,
> = Simplify<
	{ [key in `Gsi${T}Pk`]: string } & {
		[key in `Gsi${T}Sk`]: TValue;
	}
>;
type RawTableItemGsi1Key = RawTableItemGsiKey<1, string>;
type RawTableItemGsi2Key = RawTableItemGsiKey<2, string>;
type RawTableItemGsi3Key = RawTableItemGsiKey<3, string>;

type RawTableItemKeys = RawTableItemPrimaryKey &
	RawTableItemGsi1Key &
	RawTableItemGsi2Key &
	RawTableItemGsi3Key;

type RemoveRawTableItemKey<
	TEntries extends Partial<Record<keyof RawTableItemKeys, unknown>> & {
		[TEntryKey in keyof TEntries]: TEntryKey extends keyof RawTableItemKeys
			? TEntries[TEntryKey]
			: never;
	},
> = OverrideProperties<
	{
		[TRawTableItemKey in keyof RawTableItemKeys]?: never;
	},
	TEntries
>;

export type RawTableItem = (
	| RemoveRawTableItemKey<RawTableItemPrimaryKey>
	| RemoveRawTableItemKey<RawTableItemPrimaryKey & RawTableItemGsi1Key>
	| RemoveRawTableItemKey<
			RawTableItemPrimaryKey & RawTableItemGsi1Key & RawTableItemGsi2Key
	  >
	| RemoveRawTableItemKey<
			RawTableItemPrimaryKey &
				RawTableItemGsi1Key &
				RawTableItemGsi2Key &
				RawTableItemGsi3Key
	  >
) & { Expiration?: number | undefined };

export function tableItem<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	TItemSchema extends v.GenericSchema<RawTableItem, any>,
>(schema: TItemSchema) {
	return v.pipe(
		schema,
		v.transform((value) => omit(value, Array.from(keysToOmit))),
		v.transform(deepCamelKeys),
	);
}

const keysToOmit = [
	'Pk',
	'Sk',
	'Gsi1Pk',
	'Gsi1Sk',
	'Gsi2Pk',
	'Gsi2Sk',
	'Gsi3Pk',
	'Gsi3Sk',
	'Expiration',
] as const;
