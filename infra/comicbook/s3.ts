import { prefix } from '../utils';

const prefixComponentName = prefix('ComicbookS3');

export const bucket = new sst.aws.Bucket(prefixComponentName('Bucket'), {
	transform: {
		bucket: {
			forceDestroy: true,
		},
	},
});

new aws.s3.BucketNotification(
	prefixComponentName('BucketEventBridgeNotification'),
	{
		bucket: bucket.name,
		eventbridge: true,
	},
);
