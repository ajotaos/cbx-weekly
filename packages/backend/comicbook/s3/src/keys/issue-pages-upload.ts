import { makeBucketObjectKey } from '@cbx-weekly/backend-core-s3';

export type MakeIssuePagesUploadBucketObjectKeyProps = {
	id: string;
};

export function makeIssuePagesUploadBucketObjectKey(
	props: MakeIssuePagesUploadBucketObjectKeyProps,
) {
	return makeBucketObjectKey('issues', 'pages', 'uploads', `${props.id}.zip`);
}
