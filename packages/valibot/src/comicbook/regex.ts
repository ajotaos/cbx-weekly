export const PUBLISHER_TITLE_REGEX = /^(?<name>\S+(?:\s\S+)*)$/u;
export const PUBLISHER_NAME_REGEX = /^\S+(?:\s\S+)*$/u;

export const PUBLISHER_PARTITION_KEY_REGEX =
	/^publisher:id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;
export const PUBLISHER_SORT_KEY_REGEX = /^#$/u;

export const PUBLISHER_GSI1_PARTITION_KEY_REGEX =
	/^publisher:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;
export const PUBLISHER_GSI1_SORT_KEY_REGEX = /^#$/u;

export const PUBLISHER_GSI2_PARTITION_KEY_REGEX = /^publisher:#$/u;
export const PUBLISHER_GSI2_SORT_KEY_REGEX =
	/^slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const PUBLISHER_GSI2_CURSOR_REGEX =
	/^publisher:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;

export const PUBLISHER_UNIQUE_SLUG_PARTITION_KEY_REGEX =
	/^publisher:unq:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;
export const PUBLISHER_UNIQUE_SLUG_SORT_KEY_REGEX = /^#$/u;

export const SERIES_TITLE_REGEX =
	/^(?<publisher>\S+(?:\s\S+)*) > (?<name>\S+(?:\s\S+)* \(\d{4}\))$/u;
export const SERIES_NAME_REGEX = /^\S+(?:\s\S+)* \(\d{4}\)$/u;

export const SERIES_PARTITION_KEY_REGEX =
	/^series:id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;
export const SERIES_SORT_KEY_REGEX = /^#$/u;

export const SERIES_GSI1_PARTITION_KEY_REGEX =
	/^series:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;
export const SERIES_GSI1_SORT_KEY_REGEX = /^#$/u;

export const SERIES_GSI2_PARTITION_KEY_REGEX =
	/^series:publisher-id:(?<publisherId>[\da-hjkmnp-tv-z]{26}):#$/u;
export const SERIES_GSI2_SORT_KEY_REGEX =
	/^slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const SERIES_GSI2_CURSOR_REGEX =
	/^series:publisher-id:(?<publisherId>[\da-hjkmnp-tv-z]{26}):slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;

export const SERIES_GSI3_PARTITION_KEY_REGEX =
	/^series:release-week:(?<releaseWeek>\d{4}-W(?:0[1-9]|[1-4]\d|5[0-3])):#$/u;
export const SERIES_GSI3_SORT_KEY_REGEX =
	/^release-weekday:(?<releaseWeekday>[1-7]):slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const SERIES_GSI3_CURSOR_REGEX =
	/^series:release-date:(?<releaseDate>\d{4}-W(?:0[1-9]|[1-4]\d|5[0-3])-[1-7]):slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;

export const SERIES_UNIQUE_SLUG_PARTITION_KEY_REGEX =
	/^series:unq:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;
export const SERIES_UNIQUE_SLUG_SORT_KEY_REGEX = /^#$/u;

export const ISSUE_TITLE_REGEX =
	/^(?<publisher>\S+(?:\s\S+)*) > (?<series>\S+(?:\s\S+)* \(\d{4}\)) #(?<number>(?:0|[1-9]\d*)(?:\.[A-Z0-9]+)?)$/u;
export const ISSUE_NUMBER_REGEX = /^(?:0|[1-9]\d*)(?:\.[A-Z0-9]+)?$/u;

export const ISSUE_PARTITION_KEY_REGEX =
	/^issue:id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;
export const ISSUE_SORT_KEY_REGEX = /^#$/u;

export const ISSUE_GSI1_PARTITION_KEY_REGEX =
	/^issue:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;
export const ISSUE_GSI1_SORT_KEY_REGEX = /^#$/u;

export const ISSUE_GSI2_PARTITION_KEY_REGEX =
	/^issue:series-id:(?<seriesId>[\da-hjkmnp-tv-z]{26}):#$/u;
export const ISSUE_GSI2_SORT_KEY_REGEX =
	/^slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const ISSUE_GSI2_CURSOR_REGEX =
	/^issue:series-id:(?<seriesId>[\da-hjkmnp-tv-z]{26}):slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;

export const ISSUE_GSI3_PARTITION_KEY_REGEX =
	/^issue:release-week:(?<releaseWeek>\d{4}-W(?:0[1-9]|[1-4]\d|5[0-3])):#$/u;
export const ISSUE_GSI3_SORT_KEY_REGEX =
	/^release-weekday:(?<releaseWeekday>[1-7]):slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const ISSUE_GSI3_CURSOR_REGEX =
	/^issue:release-date:(?<releaseDate>\d{4}-W(?:0[1-9]|[1-4]\d|5[0-3])-[1-7]):slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;

export const ISSUE_UNIQUE_SLUG_PARTITION_KEY_REGEX =
	/^issue:unq:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;
export const ISSUE_UNIQUE_SLUG_SORT_KEY_REGEX = /^#$/u;

export const ISSUE_UNIQUE_PAGESET_ID_PARTITION_KEY_REGEX =
	/^issue:unq:pageset-id:(?<pagesetId>[\da-z]+(?:-[\da-z]+)*):#$/u;
export const ISSUE_UNIQUE_PAGESET_ID_SORT_KEY_REGEX = /^#$/u;

export const PAGESET_PARTITION_KEY_REGEX =
	/^pageset:id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;
export const PAGESET_SORT_KEY_REGEX = /^#$/u;

export const PAGESET_GSI1_PARTITION_KEY_REGEX =
	/^pageset:issue-id:(?<issueId>[\da-hjkmnp-tv-z]{26}):#$/u;
export const PAGESET_GSI1_SORT_KEY_REGEX =
	/^created:epoch:(?<created>-?(?:0|[1-9]\d*)):#$/u;

export const PAGESET_GSI1_CURSOR_REGEX =
	/^pageset:issue-id:(?<issueId>[\da-hjkmnp-tv-z]{26}):created:epoch:(?<created>-?(?:0|[1-9]\d*)):id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;

export const PAGESET_CONTENTS_PREFIX_REGEX =
	/^pagesets\/(?<pagesetId>[\da-hjkmnp-tv-z]{26})\/$/u;

export const PAGESET_UPLOAD_KEY_REGEX =
	/^pagesets\/(?<pagesetId>[\da-hjkmnp-tv-z]{26})\/upload.zip$/u;

export const PAGESET_ARCHIVE_KEY_REGEX =
	/^pagesets\/(?<pagesetId>[\da-hjkmnp-tv-z]{26})\/archive.cbz$/u;

export const PAGESET_PAGE_NUMBER_REGEX = /^\d{3}$/u;

export const PAGESET_PAGE_KEY_REGEX =
	/^pagesets\/(?<pagesetId>[\da-hjkmnp-tv-z]{26})\/pages\/(?<number>\d{3}).raw.jpg$/u;

export const PAGESET_PAGE_THUMBNAIL_KEY_REGEX =
	/^pagesets\/(?<pagesetId>[\da-hjkmnp-tv-z]{26})\/pages\/(?<number>\d{3}).thumbnail.jpg$/u;
