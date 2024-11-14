import { makeIssueNumberSlug } from './utils/issue';
import { makePublisherNameSlug } from './utils/publisher';
import { makeSeriesNameSlug } from './utils/series';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makeIssueSlug(components: v_comicbook.IssueTitleComponents) {
	return [
		makePublisherNameSlug(components.publisher),
		makeSeriesNameSlug(components.series),
		makeIssueNumberSlug(components.number),
	].join('-');
}
