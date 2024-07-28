import type {
	APIGatewayProxyEventV2 as BaseApiGatewayEvent,
	APIGatewayProxyStructuredResultV2 as BaseApiGatewayResult,
} from 'aws-lambda';

import type { Except, JsonValue, Jsonifiable, Simplify } from 'type-fest';

export type ApiGatewayEvent = Simplify<
	Except<
		BaseApiGatewayEvent,
		| 'headers'
		| 'pathParameters'
		| 'queryStringParameters'
		| 'body'
		| 'isBase64Encoded'
		| 'stageVariables'
		| 'requestContext'
	> & {
		headers: Record<string, string>;
		pathParameters: Record<string, string>;
		queryStringParameters: Record<string, string>;
		body: JsonValue;
		requestContext: ApiGatewayEventRequestContext;
	}
>;

export type ApiGatewayEventRequestContext = {
	accountId: string;
	apiId: string;
	authentication?: {
		clientCert: ApiGatewayEventClientCertificate;
	};
	domainName: string;
	domainPrefix: string;
	http: {
		method: ApiGatewayEventHttpMethod;
		path: string;
		protocol: string;
		sourceIp: string;
		userAgent: string;
	};
	requestId: string;
	routeKey: string;
	stage: string;
	time: string;
	timeEpoch: number;
};

export type ApiGatewayEventClientCertificate = {
	clientCertPem: string;
	serialNumber: string;
	subjectDN: string;
	issuerDN: string;
	validity: {
		notAfter: string;
		notBefore: string;
	};
};

export type ApiGatewayEventHttpMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'PATCH'
	| 'DELETE'
	| 'HEAD'
	| 'OPTIONS';

export type ApiGatewayResult = Simplify<
	Except<
		BaseApiGatewayResult,
		'statusCode' | 'headers' | 'body' | 'isBase64Encoded'
	> & {
		statusCode: number;
		headers?: Record<string, string>;
		body: Jsonifiable;
	}
>;
