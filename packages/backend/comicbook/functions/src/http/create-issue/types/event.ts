import { apiGatewayEvent } from '@cbx-weekly/backend-core-functions';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export const eventSchema = apiGatewayEvent(
	v.strictObject({
		title: v.strictObject({
			publisher: v.pipe(v.string(), vx.publisherName()),
			series: v.pipe(v.string(), vx.seriesName()),
			number: v.pipe(v.string(), vx.issueNumber()),
		}),
		seriesId: v.pipe(v.string(), vx.ulid()),
		releaseDate: v.pipe(v.string(), v.isoDate()),
	}),
	v.any(),
	v.any(),
);
