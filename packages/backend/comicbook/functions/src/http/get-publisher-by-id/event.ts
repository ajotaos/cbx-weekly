import * as v from '@cbx-weekly/backend-core-valibot';

import { camelKeys } from 'string-ts';

export const eventSchema = v.object({
	pathParameters: v.pipe(
		v.strictObject({
			publisher_id: v.pipe(v.string(), v.id()),
		}),
		v.transform(camelKeys),
	),
});
