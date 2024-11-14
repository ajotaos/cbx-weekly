import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

export const recordSchema = v.object({
	body: v.object({
		detail: v.object({
			object: v.object({
				key: v_comicbook.pagesetUploadKeyComponentsSchema,
			}),
		}),
	}),
});
