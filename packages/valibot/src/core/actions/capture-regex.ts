import * as v from 'valibot';

export function captureRegex(
	regex: RegExp,
	message?: v.ErrorMessage<v.RawTransformIssue<string>> | undefined,
): v.RawTransformAction<string, Record<string, string>> {
	return v.rawTransform(({ dataset, addIssue, NEVER }) => {
		const match = regex.exec(dataset.value);

		if (!match) {
			addIssue({
				expected: String(regex),
				message:
					message ??
					((issue) =>
						`Invalid format: Expected ${String(regex)} but received "${issue.input}"`),
			});

			return NEVER;
		}

		return match.groups ?? {};
	});
}
