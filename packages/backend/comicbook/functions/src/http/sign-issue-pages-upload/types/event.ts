import { apiGatewayEvent } from '@cbx-weekly/backend-core-functions';

import * as vx from '@cbx-weekly/backend-comicbook-valibot';
import * as v from 'valibot';

export const eventSchema = apiGatewayEvent(
	v.strictObject({
		issueId: v.pipe(v.string(), vx.ulid()),
	}),
	v.any(),
	v.any(),
);
