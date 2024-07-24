import { IdempotencyConfig } from '@aws-lambda-powertools/idempotency';
import { DynamoDBPersistenceLayer } from '@aws-lambda-powertools/idempotency/dynamodb';

import type { BasePersistenceLayer } from '@aws-lambda-powertools/idempotency/persistence';

export declare namespace Idempotency {
	type Options = {
		keyPath?: string;
		expiresAfterSeconds?: number;
	};
}

export class Idempotency {
	static create(tableName: string, options?: Idempotency.Options) {
		const persistenceStore = new DynamoDBPersistenceLayer({
			tableName,
			keyAttr: 'Pk',
			expiryAttr: 'Expiration',
			inProgressExpiryAttr: 'InProgressExpiration',
			statusAttr: 'Status',
			dataAttr: 'Data',
			validationKeyAttr: 'Validation',
		});

		const config = new IdempotencyConfig({
			eventKeyJmesPath: options?.keyPath as string,
			expiresAfterSeconds: options?.expiresAfterSeconds as number,
			throwOnNoIdempotencyKey: true,
		});

		return new Idempotency(persistenceStore, config);
	}

	constructor(
		readonly persistenceStore: BasePersistenceLayer,
		readonly config: IdempotencyConfig,
	) {}
}
