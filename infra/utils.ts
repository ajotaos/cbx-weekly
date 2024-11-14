import { join } from 'node:path';

export function servicePaths(service: string, subservice: string) {
	return {
		makeFunctionHandlerPath(name: string) {
			return join(
				'packages',
				'functions',
				'src',
				service,
				subservice,
				name,
				'index.main',
			);
		},
	} as const;
}

export function prefix(prefix: string) {
	return (string: string) => prefix + string;
}
