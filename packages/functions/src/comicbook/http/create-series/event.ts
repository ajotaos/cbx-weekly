import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

export const eventSchema = v.object({
	body: v.strictObject({
		title: v_comicbook.seriesTitleComponentsSchema,
		releaseDate: v.pipe(v.string(), v.isoWeekDate()),
		publisherId: v.pipe(v.string(), v.id()),
	}),
});
