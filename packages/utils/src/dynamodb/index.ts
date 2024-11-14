import {
	makePartitionKey as _makePartitionKey,
	makeSortKey as _makeSortKey,
} from './keys';

import { deleteItem as _deleteItem } from './delete-item';
import { getItem as _getItem } from './get-item';
import { putItem as _putItem } from './put-item';
import { queryItems as _queryItems } from './query-items';
import { updateItem as _updateItem } from './update-item';

import { createTransactionWriteBuilder as _createTransactionWriteBuilder } from './transact-write-items';

import { itemAlreadyExistsError, itemNotFoundError } from './errors';

export namespace Dynamodb {
	export const getItem = _getItem;
	export const queryItems = _queryItems;
	export const putItem = _putItem;
	export const updateItem = _updateItem;
	export const deleteItem = _deleteItem;

	export const createTransactionWriteBuilder = _createTransactionWriteBuilder;

	export namespace Keys {
		export const makePartitionKey = _makePartitionKey;
		export const makeSortKey = _makeSortKey;
	}

	export namespace Errors {
		export const itemAlreadyExists = itemAlreadyExistsError;
		export const itemNotFound = itemNotFoundError;
	}
}
