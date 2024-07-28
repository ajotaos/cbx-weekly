export const PUBLISHER_TABLE_ITEM_PARTITION_KEY_REGEX =
	/^publishers:id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;

export const PUBLISHER_TABLE_ITEM_GSI1_PARTITION_KEY_REGEX =
	/^publishers:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const PUBLISHER_TABLE_ITEM_GSI2_SORT_KEY_REGEX =
	/^slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const PUBLISHER_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_REGEX =
	/^publishers:unq:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const PUBLISHER_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX =
	/^publishers:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;

export const SERIES_TABLE_ITEM_PARTITION_KEY_REGEX =
	/^series:id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;

export const SERIES_TABLE_ITEM_GSI1_PARTITION_KEY_REGEX =
	/^series:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const SERIES_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX =
	/^series:publisher-id:(?<publisherId>[\da-hjkmnp-tv-z]{26}):#$/u;

export const SERIES_TABLE_ITEM_GSI2_SORT_KEY_REGEX =
	/^slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const SERIES_TABLE_ITEM_GSI3_PARTITION_KEY_REGEX =
	/^series:release-date:(?<releaseDate>\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])):#$/u;

export const SERIES_TABLE_ITEM_GSI3_SORT_KEY_REGEX =
	/^slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const SERIES_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_REGEX =
	/^series:unq:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const SERIES_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX =
	/^series:publisher-id:(?<publisherId>[\da-hjkmnp-tv-z]{26}):slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;

export const ISSUE_TABLE_ITEM_PARTITION_KEY_REGEX =
	/^issues:id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;

export const ISSUE_TABLE_ITEM_GSI1_PARTITION_KEY_REGEX =
	/^issues:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const ISSUE_TABLE_ITEM_GSI2_PARTITION_KEY_REGEX =
	/^issues:series-id:(?<seriesId>[\da-hjkmnp-tv-z]{26}):#$/u;

export const ISSUE_TABLE_ITEM_GSI2_SORT_KEY_REGEX =
	/^slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const ISSUE_TABLE_ITEM_GSI3_PARTITION_KEY_REGEX =
	/^issues:release-date:(?<releaseDate>\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])):#$/u;

export const ISSUE_TABLE_ITEM_GSI3_SORT_KEY_REGEX =
	/^slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const ISSUE_UNIQUE_SLUG_TABLE_ITEM_PARTITION_KEY_REGEX =
	/^issues:unq:slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):#$/u;

export const ISSUE_TABLE_ITEM_GSI2_PAGINATION_CURSOR_REGEX =
	/^issues:series-id:(?<seriesId>[\da-hjkmnp-tv-z]{26}):slug:(?<slug>[\da-z]+(?:-[\da-z]+)*):id:(?<id>[\da-hjkmnp-tv-z]{26}):#$/u;
