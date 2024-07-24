import * as v from 'valibot';

export function parseEnvironment<
	const TSchema extends v.GenericSchema<NodeJS.ProcessEnv, unknown>,
>(
	schema: TSchema,
	config?: Omit<v.Config<v.InferIssue<TSchema>>, 'SkipPipe'>,
	processEnv: NodeJS.ProcessEnv = process.env,
) {
	return v.parse(schema, processEnv, config);
}
