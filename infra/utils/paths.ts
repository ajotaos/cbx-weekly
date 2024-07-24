import { join } from 'node:path';

export function makeFunctionHandlerPathFactory(
	service: string,
	subservice: string,
) {
	return (handler: string) =>
		join(
			'packages',
			'backend',
			service,
			'functions',
			'src',
			subservice,
			handler,
			'index.main',
		);
}
