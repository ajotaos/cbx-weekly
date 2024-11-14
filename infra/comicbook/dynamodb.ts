import { prefix } from '../utils';

const prefixComponentName = prefix('ComicbookDynamodb');

export const table = new sst.aws.Dynamo(prefixComponentName('Table'), {
	fields: {
		Pk: 'string',
		Sk: 'string',
		Gsi1Pk: 'string',
		Gsi1Sk: 'string',
		Gsi2Pk: 'string',
		Gsi2Sk: 'string',
		Gsi3Pk: 'string',
		Gsi3Sk: 'string',
	},
	primaryIndex: {
		hashKey: 'Pk',
		rangeKey: 'Sk',
	},
	globalIndexes: {
		Gsi1: { hashKey: 'Gsi1Pk', rangeKey: 'Gsi1Sk' },
		Gsi2: { hashKey: 'Gsi2Pk', rangeKey: 'Gsi2Sk' },
		Gsi3: { hashKey: 'Gsi3Pk', rangeKey: 'Gsi3Sk' },
	},
	ttl: 'Expiration',
	stream: 'new-and-old-images',
});
