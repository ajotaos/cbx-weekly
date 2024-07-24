import { prefixComponentNameFactory } from '../utils/prefix';

const prefixComponentName = prefixComponentNameFactory('ComicbookS3');

export const bucket = new sst.aws.Bucket(prefixComponentName(''), {
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
