import * as v from '@cbx-weekly/valibot/core';

import { camelKeys } from 'string-ts';

export const eventSchema = v.object({
	queryStringParameters: v.pipe(
		v.strictObject({
			id: v.pipe(v.string(), v.id()),
		}),
		v.transform(camelKeys),
	),
});
