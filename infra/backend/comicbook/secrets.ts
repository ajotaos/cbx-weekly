import { prefix } from '../../utils/prefix';

const prefixComponentName = prefix('ComicbookSecrets');

export const comicbook = {
	cursors: {
		listPublishers: new sst.Secret(
			prefixComponentName('ListPublishersCursorSecret'),
		),
		listSeriesByPublisher: new sst.Secret(
			prefixComponentName('ListSeriesByPublisherCursorSecret'),
		),
		listIssuesBySeries: new sst.Secret(
			prefixComponentName('ListIssuesBySeriesCursorSecret'),
		),
	},
} as const;
