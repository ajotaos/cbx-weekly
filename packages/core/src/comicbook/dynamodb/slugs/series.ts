import { makePublisherNameSlug } from './utils/publisher';
import { makeSeriesNameSlug } from './utils/series';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makeSeriesSlug(components: v_comicbook.SeriesTitleComponents) {
	return [
		makePublisherNameSlug(components.publisher),
		makeSeriesNameSlug(components.name),
	].join('-');
}
