import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import { camelKeys } from 'string-ts';

export const eventSchema = v.object({
	pathParameters: v.pipe(
		v.strictObject({
			series_id: v.pipe(v.string(), vx.ulid()),
		}),
		v.transform(camelKeys),
	),
	queryStringParameters: v.pipe(
		v.strictObject({
			cursor: v.optional(v.pipe(v.string(), v.nonEmpty())),
			order: v.optional(v.picklist(['asc', 'desc'])),
			limit: v.optional(
				v.pipe(
					v.string(),
					v.digits(),
					v.transform((value) => Number(value)),
					v.integer(),
					v.minValue(1),
				),
			),
		}),
		v.transform(camelKeys),
	),
});
