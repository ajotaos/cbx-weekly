import { Resource } from 'sst';

import { Http } from '@cbx-weekly/utils/http';

export const { sign: signCursor, verify: verifyCursor } =
	Http.PaginationCursor.makeUtils(
		Resource.ComicbookHttpApiListIssuesByReleaseWeekCursorSecret.value,
	);
