import type {
	IssuePage,
	IssuePageThumbnail,
	IssuePagesArchive,
	IssuePagesUpload,
} from './types';

export * from './methods';
export * from './valibot/regex';

export type IssuePageBucketObject = IssuePage.BucketObject;
export type IssuePageThumbnailBucketObject = IssuePageThumbnail.BucketObject;
export type IssuePagesArchiveBucketObject = IssuePagesArchive.BucketObject;
export type IssuePagesUploadBucketObject = IssuePagesUpload.BucketObject;
