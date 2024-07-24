export const ISSUE_PAGE_BUCKET_OBJECT_KEY_REGEX =
	/^issues\/[\da-hjkmnp-tv-z]{26}\/pages\/[\da-hjkmnp-tv-z]{26}\.raw\.jpg$/u;
export const ISSUE_PAGE_BUCKET_OBJECT_KEY_CAPTURE_REGEX =
	/^issues\/(?<issueId>.*)\/pages\/(?<id>.*)\.raw\.jpg$/u;

export const ISSUE_PAGE_THUMBNAIL_BUCKET_OBJECT_KEY_REGEX =
	/^issues\/[\da-hjkmnp-tv-z]{26}\/pages\/[\da-hjkmnp-tv-z]{26}\.thumbnail\.jpg$/u;
export const ISSUE_PAGE_THUMBNAIL_BUCKET_OBJECT_KEY_CAPTURE_REGEX =
	/^issues\/(?<issueId>.*)\/pages\/(?<id>.*)\.thumbnail\.jpg$/u;

export const ISSUE_PAGES_ARCHIVE_BUCKET_OBJECT_KEY_REGEX =
	/^issues\/[\da-hjkmnp-tv-z]{26}\/pages\/archives\/[\da-hjkmnp-tv-z]{26}\.cbz$/u;
export const ISSUE_PAGES_ARCHIVE_BUCKET_OBJECT_KEY_CAPTURE_REGEX =
	/^issues\/(?<issueId>.*)\/pages\/archives\/(?<id>.*)\.cbz$/u;

export const ISSUE_PAGES_UPLOAD_BUCKET_OBJECT_KEY_REGEX =
	/^issues\/[\da-hjkmnp-tv-z]{26}\/pages\/uploads\/[\da-hjkmnp-tv-z]{26}\.zip$/u;
export const ISSUE_PAGES_UPLOAD_BUCKET_OBJECT_KEY_CAPTURE_REGEX =
	/^issues\/(?<issueId>.*)\/pages\/uploads\/(?<id>.*)\.zip$/u;
