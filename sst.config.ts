/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'cbx-weekly',
			protected: input.stage === 'production',
			removal: input.stage === 'production' ? 'retain' : 'remove',
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
			args.runtime ??= 'nodejs22.x';
			args.architecture ??= 'arm64';
		});

		await import('./infra');
	},
});
