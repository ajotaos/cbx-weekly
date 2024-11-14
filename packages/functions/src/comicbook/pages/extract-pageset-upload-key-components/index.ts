import * as v_comicbook from '@cbx-weekly/valibot/comicbook';
import * as v from '@cbx-weekly/valibot/core';

import type { SQSRecord } from 'aws-lambda';

export function main(records: Array<SQSRecord>) {
	return parseSqsRecords(records);
}

const parseSqsRecords = v.parser(
	v.array(
		v.pipe(
			v.object({
				body: v.pipe(
					v.string(),
					v.transform((string) => JSON.parse(string)),
					v.object({
						detail: v.object({
							object: v.object({
								key: v.pipe(
									v.string(),
									v_comicbook.capturePagesetUploadKeyComponents(),
								),
							}),
						}),
					}),
				),
			}),
			v.transform((value) => value.body),
		),
	),
);
