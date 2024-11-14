import { makePublisherNameSlug } from './utils/publisher';

import type * as v_comicbook from '@cbx-weekly/valibot/comicbook';

export function makePublisherSlug(
	components: v_comicbook.PublisherTitleComponents,
) {
	return [makePublisherNameSlug(components.name)].join('-');
}
