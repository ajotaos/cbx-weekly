import { deepCamelKeys } from 'string-ts';

import * as v from '@cbx-weekly/backend-core-valibot';

export const recordSchema = v.object({
	body: v.object({
		eventName: v.literal('MODIFY'),
		dynamodb: v.pipe(
			v.object({
				StreamViewType: v.literal('NEW_AND_OLD_IMAGES'),
				NewImage: v.object({
					Id: v.string(),
					Pages: v.object({
						Archive: v.optional(
							v.object({
								Id: v.string(),
								PageIds: v.array(v.string()),
							}),
						),
					}),
					LatestUpdate: v.object({
						Id: v.string(),
					}),
				}),
				OldImage: v.object({
					Pages: v.object({
						Archive: v.optional(
							v.object({
								Id: v.string(),
								PageIds: v.array(v.string()),
							}),
						),
					}),
					// Pages: v.union([
					// 	v.pipe(
					// 		v.object({
					// 			State: v.literal('pending'),
					// 		}),
					// 		v.transform((value) => ({
					// 			...value,
					// 			PageIds: [] as Array<string>,
					// 			ArchiveId: undefined,
					// 		})),
					// 	),
					// 	v.object({
					// 		State: v.literal('ready'),
					// 		PageIds: v.array(v.string()),
					// 		ArchiveId: v.string(),
					// 	}),
					// ]),
				}),
			}),
			v.transform(deepCamelKeys),
		),
	}),
});
