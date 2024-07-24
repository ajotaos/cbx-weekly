import { apiGatewayEvent } from '@cbx-weekly/backend-core-functions';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export const eventSchema = apiGatewayEvent(
	v.strictObject({
		title: v.strictObject({
			name: v.pipe(v.string(), vx.publisherName()),
		}),
	}),
	v.any(),
	v.any(),
);
