/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
	app(input) {
		return {
			name: 'cbx-weekly',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			providers: { 'aws-native': { region: 'us-east-1' } },
			home: 'aws',
		};
	},
	async run() {
		sst.Linkable.wrap(sst.aws.Dynamo, (dynamo) => ({
			properties: { name: dynamo.name },
		}));

		sst.Linkable.wrap(sst.aws.Bucket, (bucket) => ({
			properties: { name: bucket.name },
		}));

		$transform(sst.aws.Function, (args) => {
			args.logging ??= { retention: '1 month' };
			args.architecture ??= 'arm64';
		});

		await import('./infra');
	},
});
