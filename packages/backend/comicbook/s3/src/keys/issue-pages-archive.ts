import { makeBucketObjectKey } from '@cbx-weekly/backend-core-s3';

export type MakeIssuePagesArchiveBucketObjectKeyProps = {
	id: string;
};

export function makeIssuePagesArchiveBucketObjectKey(
	props: MakeIssuePagesArchiveBucketObjectKeyProps,
) {
	return makeBucketObjectKey('issues', 'pages', 'archives', `${props.id}.cbz`);
}
