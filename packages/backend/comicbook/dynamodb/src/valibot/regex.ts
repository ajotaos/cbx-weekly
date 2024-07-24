export const PUBLISHER_TABLE_ITEM_NAME_REGEX = /^\S+(?:\s\S)*$/u;

export const PUBLISHER_TABLE_ITEM_PARTITION_KEY_REGEX =
	/^publishers:id:[\da-hjkmnp-tv-z]{26}:#$/u;
export const PUBLISHER_TABLE_ITEM_PARTITION_KEY_CAPTURE_REGEX =
	/^publishers:id:(?<id>.*):#$/u;

export const PUBLISHER_TABLE_ITEM_SORT_KEY_REGEX = /^#$/u;

export const PUBLISHER_TABLE_ITEM_GSI1_PARTITION_KEY_REGEX =
	/^publishers:slug:[\da-z]+(?:-[\da-z]+)*:#$/u;
export const PUBLISHER_TABLE_ITEM_GSI1_PARTITION_KEY_CAPTURE_REGEX =
	/^publishers:slug:(?<slug>.*):#$/u;

export const PUBLISHER_TABLE_ITEM_GSI1_SORT_KEY_REGEX = /^#$/u;

export const PUBLISHER_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX = /^publishers:#$/u;

export const PUBLISHER_TABLE_ITEM_GSI2_SORT_KEY_REGEX =
	/^slug:[\da-z]+(?:-[\da-z]+)*:#$/u;
export const PUBLISHER_TABLE_ITEM_GSI2_SORT_KEY_CAPTURE_REGEX =
	/^slug:(?<slug>.*):#$/u;

export const PUBLISHER_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_REGEX =
	/^publishers:unq:slug:[\da-z]+(?:-[\da-z]+)*:#$/u;
export const PUBLISHER_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_CAPTURE_REGEX =
	/^publishers:unq:slug:(?<slug>.*):#$/u;

export const PUBLISHER_UNIQUE_SLUG_TABLE_ITEM_SORT_KEY_REGEX = /^#$/u;

export const PUBLISHER_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX =
	/^publishers:slug:[\da-z]+(?:-[\da-z]+)*:id:[\da-hjkmnp-tv-z]{26}:#$/u;
export const PUBLISHER_TABLE_ITEM_GSI2_PAGINATION_CURSOR_CAPTURE_REGEX =
	/^publishers:slug:(?<slug>.*):id:(?<id>.*):#$/u;

export const SERIES_TABLE_ITEM_NAME_REGEX = /^\S+(?:\s\S)* \(\d{4}\)$/u;

export const SERIES_TABLE_ITEM_PARTITION_KEY_REGEX =
	/^series:id:[\da-hjkmnp-tv-z]{26}:#$/u;
export const SERIES_TABLE_ITEM_PARTITION_KEY_CAPTURE_REGEX =
	/^series:id:(?<id>.*):#$/u;

export const SERIES_TABLE_ITEM_SORT_KEY_REGEX = /^#$/u;

export const SERIES_TABLE_ITEM_GSI1_PARTITION_KEY_REGEX =
	/^series:slug:[\da-z]+(?:-[\da-z]+)*:#$/u;
export const SERIES_TABLE_ITEM_GSI1_PARTITION_KEY_CAPTURE_REGEX =
	/^series:slug:(?<slug>.*):#$/u;

export const SERIES_TABLE_ITEM_GSI1_SORT_KEY_REGEX = /^#$/u;

export const SERIES_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX =
	/^series:publisher-id:[\da-hjkmnp-tv-z]{26}:#$/u;
export const SERIES_TABLE_ITEM_GSI2_PARTITION_KEY_CAPTURE_REGEX =
	/^series:publisher-id:(?<publisherId>.*):#$/u;

export const SERIES_TABLE_ITEM_GSI2_SORT_KEY_REGEX =
	/^slug:[\da-z]+(?:-[\da-z]+)*:#$/u;
export const SERIES_TABLE_ITEM_GSI2_SORT_KEY_CAPTURE_REGEX =
	/^slug:(?<slug>.*):#$/u;

export const SERIES_TABLE_ITEM_GSI3_PARTITION_KEY_REGEX =
	/^series:release-date:\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01]):#$/u;
export const SERIES_TABLE_ITEM_GSI3_PARTITION_KEY_CAPTURE_REGEX =
	/^series:release-date:(?<releaseDate>.*):#$/u;

export const SERIES_TABLE_ITEM_GSI3_SORT_KEY_REGEX =
	/^slug:[\da-z]+(?:-[\da-z]+)*:#$/u;
export const SERIES_TABLE_ITEM_GSI3_SORT_KEY_CAPTURE_REGEX =
	/^slug:(?<slug>.*):#$/u;

export const SERIES_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_REGEX =
	/^series:unq:slug:[\da-z]+(?:-[\da-z]+)*:#$/u;
export const SERIES_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_CAPTURE_REGEX =
	/^series:unq:slug:(?<slug>.*):#$/u;

export const SERIES_UNIQUE_SLUG_TABLE_ITEM_SORT_KEY_REGEX = /^#$/u;

export const SERIES_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX =
	/^series:publisher-id:[\da-hjkmnp-tv-z]{26}:slug:[\da-z]+(?:-[\da-z]+)*:id:[\da-hjkmnp-tv-z]{26}:#$/u;
export const SERIES_TABLE_ITEM_GSI2_PAGINATION_CURSOR_CAPTURE_REGEX =
	/^series:publisher-id:(?<publisherId>.*):slug:(?<slug>.*):id:(?<id>.*):#$/u;

export const ISSUE_TABLE_ITEM_NUMBER_REGEX = /^\d+(?:\.[A-Z0-9]+)?$/u;

export const ISSUE_TABLE_ITEM_PARTITION_KEY_REGEX =
	/^issues:id:[\da-hjkmnp-tv-z]{26}:#$/u;
export const ISSUE_TABLE_ITEM_PARTITION_KEY_CAPTURE_REGEX =
	/^issues:id:(?<id>.*):#$/u;

export const ISSUE_TABLE_ITEM_SORT_KEY_REGEX = /^#$/u;

export const ISSUE_TABLE_ITEM_GSI1_PARTITION_KEY_REGEX =
	/^issues:slug:[\da-z]+(?:-[\da-z]+)*:#$/u;
export const ISSUE_TABLE_ITEM_GSI1_PARTITION_KEY_CAPTURE_REGEX =
	/^issues:slug:(?<slug>.*):#$/u;

export const ISSUE_TABLE_ITEM_GSI1_SORT_KEY_REGEX = /^#$/u;

export const ISSUE_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX =
	/^issues:series-id:[\da-hjkmnp-tv-z]{26}:#$/u;
export const ISSUE_TABLE_ITEM_GSI2_PARTITION_KEY_CAPTURE_REGEX =
	/^issues:series-id:(?<seriesId>.*):#$/u;

export const ISSUE_TABLE_ITEM_GSI2_SORT_KEY_REGEX =
	/^slug:[\da-z]+(?:-[\da-z]+)*:#$/u;
export const ISSUE_TABLE_ITEM_GSI2_SORT_KEY_CAPTURE_REGEX =
	/^slug:(?<slug>.*):#$/u;

export const ISSUE_TABLE_ITEM_GSI3_PARTITION_KEY_REGEX =
	/^issues:release-date:\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01]):#$/u;
export const ISSUE_TABLE_ITEM_GSI3_PARTITION_KEY_CAPTURE_REGEX =
	/^issues:release-date:(?<releaseDate>.*):#$/u;

export const ISSUE_TABLE_ITEM_GSI3_SORT_KEY_REGEX =
	/^slug:[\da-z]+(?:-[\da-z]+)*:#$/u;
export const ISSUE_TABLE_ITEM_GSI3_SORT_KEY_CAPTURE_REGEX =
	/^slug:(?<slug>.*):#$/u;

export const ISSUE_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_REGEX =
	/^issues:unq:slug:[\da-z]+(?:-[\da-z]+)*:#$/u;
export const ISSUE_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_CAPTURE_REGEX =
	/^issues:unq:slug:(?<slug>.*):#$/u;

export const ISSUE_UNIQUE_SLUG_TABLE_ITEM_SORT_KEY_REGEX = /^#$/u;

export const ISSUE_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX =
	/^issues:series-id:[\da-hjkmnp-tv-z]{26}:slug:[\da-z]+(?:-[\da-z]+)*:id:[\da-hjkmnp-tv-z]{26}:#$/u;
export const ISSUE_TABLE_ITEM_GSI2_PAGINATION_CURSOR_CAPTURE_REGEX =
	/^issues:series-id:(?<seriesId>.*):slug:(?<slug>.*):id:(?<id>.*):#$/u;
