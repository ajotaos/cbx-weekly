import * as vx from '@cbx-weekly/shared-valibot';
import * as v from 'valibot';

import { camelKeys } from 'string-ts';

export const eventSchema = v.object({
	pathParameters: v.pipe(
		v.strictObject({
			publisher_id: v.pipe(v.string(), vx.ulid()),
		}),
		v.transform(camelKeys),
	),
});
