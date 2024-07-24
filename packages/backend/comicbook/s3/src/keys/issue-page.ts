import { makeBucketObjectKey } from '@cbx-weekly/backend-core-s3';

export type MakeIssuePageBucketObjectKeyProps = {
	id: string;
};

export function makeIssuePageBucketObjectKey(
	props: MakeIssuePageBucketObjectKeyProps,
) {
	return makeBucketObjectKey('issues', 'pages', `${props.id}.jpg`);
}
