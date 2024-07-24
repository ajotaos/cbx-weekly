/* tslint:disable */
/* eslint-disable */
import 'sst';
declare module 'sst' {
	export interface Resource {
		ComicbookDynamodb: {
			name: string;
			type: 'sst.aws.Dynamo';
		};
		ComicbookHttpPrivate: {
			type: 'sst.aws.ApiGatewayV2';
			url: string;
		};
		ComicbookIdempotency: {
			name: string;
			type: 'sst.aws.Dynamo';
		};
		ComicbookS3: {
			name: string;
			type: 'sst.aws.Bucket';
		};
	}
}
