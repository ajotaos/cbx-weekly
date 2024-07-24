import * as vx_dynamodb from '@cbx-weekly/backend-comicbook-dynamodb/valibot';
import * as v from '@cbx-weekly/backend-core-valibot';

import { camelKeys } from 'string-ts';

export const eventSchema = v.object({
	pathParameters: v.pipe(
		v.strictObject({
			publisher_id: v.pipe(v.string(), v.id()),
		}),
		v.transform(camelKeys),
	),
	body: v.strictObject({
		title: v.strictObject({
			publisher: v.pipe(v.string(), vx_dynamodb.publisherName()),
			name: v.pipe(v.string(), vx_dynamodb.seriesName()),
		}),
		releaseDate: v.pipe(v.string(), v.isoDate()),
	}),
});
