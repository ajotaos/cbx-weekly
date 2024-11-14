import * as v from '@cbx-weekly/valibot/core';

import { camelKeys } from 'string-ts';

export const eventSchema = v.object({
	pathParameters: v.pipe(
		v.strictObject({
			issue_id: v.pipe(v.string(), v.id()),
		}),
		v.transform(camelKeys),
	),
});
