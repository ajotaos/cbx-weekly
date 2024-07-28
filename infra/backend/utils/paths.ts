import { join } from 'node:path';

export function backendServicePaths(service: string, subservice: string) {
	return {
		makeLambdaFunctionHandlerPath(name: string) {
			return join(
				'packages',
				'backend',
				service,
				'functions',
				'src',
				subservice,
				name,
				'index.main',
			);
		},
	} as const;
}
