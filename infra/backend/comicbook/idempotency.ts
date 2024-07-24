import { prefix } from '../../utils/prefix';

const prefixComponentName = prefix('ComicbookIdempotency');

export const table = new sst.aws.Dynamo(prefixComponentName('Table'), {
	fields: {
		Pk: 'string',
	},
	primaryIndex: {
		hashKey: 'Pk',
	},
	ttl: 'Expiration',
});
