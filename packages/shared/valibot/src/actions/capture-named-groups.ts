import * as v from 'valibot';

export function captureNamedGroups<TInput extends string>(
	regex: RegExp,
): v.RawTransformAction<TInput, Record<string, string>>;

export function captureNamedGroups<
	TInput extends string,
	const TMessage extends v.ErrorMessage<v.RegexIssue<TInput>> | undefined,
>(
	regex: RegExp,
	message: TMessage,
): v.RawTransformAction<TInput, Record<string, string>>;

export function captureNamedGroups(
	regex: RegExp,
	message?: v.ErrorMessage<v.RawTransformIssue<string>>,
): v.RawTransformAction<string, Record<string, string>> {
	return v.rawTransform(({ dataset, addIssue, NEVER }) => {
		const match = regex.exec(dataset.value);

		if (!match) {
			addIssue({
				label: 'regex',
				message,
				// TODO: Is this all the configuration I require to send?
			});

			return NEVER;
		}

		return match.groups ?? {};
	});
}
