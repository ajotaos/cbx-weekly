import { prefixComponentNameFactory } from '../utils/prefix';

const prefixComponentName = prefixComponentNameFactory('ComicbookIdempotency');

export const table = new sst.aws.Dynamo(prefixComponentName(''), {
	fields: {
		Pk: 'string',
	},
	primaryIndex: {
		hashKey: 'Pk',
	},
	ttl: 'Expiration',
});
