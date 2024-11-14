import { deleteObject as _deleteObject } from './delete-object';
import { deleteObjects as _deleteObjects } from './delete-objects';
import { getObject as _getObject } from './get-object';
import { putObject as _putObject } from './put-object';
import { signPutObjectUrl as _signPutObjectUrl } from './sign-put-object-url';

import { makeKey as _makeKey } from './keys';

import { objectNotFoundError } from './errors';

export namespace S3 {
	export const getObject = _getObject;
	export const putObject = _putObject;
	export const deleteObject = _deleteObject;
	export const deleteObjects = _deleteObjects;

	export const signPutObjectUrl = _signPutObjectUrl;

	export namespace Keys {
		export const makeKey = _makeKey;
	}

	export namespace Errors {
		export const objectNotFound = objectNotFoundError;
	}
}
