export const ISSUE_PAGE_BUCKET_OBJECT_KEY_REGEX =
	/^issues\/(?<issueId>[\da-hjkmnp-tv-z]{26})\/pages\/(?<id>[\da-hjkmnp-tv-z]{26})\.raw\.jpg$/u;

export const ISSUE_PAGE_THUMBNAIL_BUCKET_OBJECT_KEY_REGEX =
	/^issues\/(?<issueId>[\da-hjkmnp-tv-z]{26})\/pages\/(?<pageId>[\da-hjkmnp-tv-z]{26})\.thumbnail\.jpg$/u;

export const ISSUE_PAGES_ARCHIVE_BUCKET_OBJECT_KEY_REGEX =
	/^issues\/(?<issueId>[\da-hjkmnp-tv-z]{26})\/pages\/archives\/(?<id>[\da-hjkmnp-tv-z]{26})\.cbz$/u;

export const ISSUE_PAGES_UPLOAD_BUCKET_OBJECT_KEY_REGEX =
	/^issues\/(?<issueId>[\da-hjkmnp-tv-z]{26})\/pages\/uploads\/(?<id>[\da-hjkmnp-tv-z]{26})\.zip$/u;
