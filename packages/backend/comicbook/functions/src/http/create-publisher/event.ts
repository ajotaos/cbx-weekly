import * as vxx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export const eventSchema = v.object({
	body: v.strictObject({
		title: v.strictObject({
			name: v.pipe(v.string(), vxx.publisherName()),
		}),
	}),
});
