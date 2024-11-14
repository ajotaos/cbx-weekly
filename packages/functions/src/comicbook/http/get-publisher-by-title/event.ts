import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import { camelKeys } from 'string-ts';

export const eventSchema = v.object({
	pathParameters: v.pipe(
		v.strictObject({
			publisher_title: v.pipe(
				v.string(),
				v_comicbook.capturePublisherTitleComponents(),
			),
		}),
		v.transform(camelKeys),
	),
});
