import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { camelKeys } from 'string-ts';

export const eventSchema = v.object({
	queryStringParameters: v.pipe(
		v.strictObject({
			publisher: v.pipe(v.string(), v_comicbook.publisherName()),
			name: v.pipe(v.string(), v_comicbook.seriesName()),
		}),
		v.transform(camelKeys),
	),
});
