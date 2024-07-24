import * as vx_dynamodb from '@cbx-weekly/backend-comicbook-dynamodb/valibot';
import * as v from '@cbx-weekly/backend-core-valibot';

export const eventSchema = v.object({
	body: v.strictObject({
		title: v.strictObject({
			name: v.pipe(v.string(), vx_dynamodb.publisherName()),
		}),
	}),
});
