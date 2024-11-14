import { makeApiGateway as _makeApiGateway } from './api-gateway';
import { makeSqs as _makeSqs, makeSqsFifo as _makeSqsFifo } from './sqs';

export namespace Lambda {
	export const makeApiGateway = _makeApiGateway;

	export const makeSqs = _makeSqs;
	export const makeSqsFifo = _makeSqsFifo;
}
