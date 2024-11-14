/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */
import "sst"
export {}
declare module "sst" {
  export interface Resource {
    "ComicbookDynamodbTable": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "ComicbookHttpApi": {
      "type": "sst.aws.ApiGatewayV2"
      "url": string
    }
    "ComicbookHttpApiListIssuesByReleaseWeekCursorSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ComicbookHttpApiListIssuesBySeriesIdCursorSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ComicbookHttpApiListPagesetsByIssueIdCursorSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ComicbookHttpApiListPublishersCursorSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ComicbookHttpApiListSeriesByPublisherIdCursorSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ComicbookHttpApiListSeriesByReleaseWeekCursorSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ComicbookPagesCleanUpIssuePagesetIdQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "ComicbookPagesCleanUpIssuePagesetIdQueueDlq": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "ComicbookPagesCleanUpPagesetContentsQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "ComicbookPagesCleanUpPagesetContentsQueueDlq": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "ComicbookPagesExtractPagesetUploadKeyComponentsFunction": {
      "name": string
      "type": "sst.aws.Function"
    }
    "ComicbookPagesExtractPagesetUploadKeyComponentsQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "ComicbookPagesExtractPagesetUploadKeyComponentsQueueDlq": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "ComicbookPagesProcessPagesetPageQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "ComicbookPagesProcessPagesetPageQueueDlq": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "ComicbookPagesProcessPagesetUploadQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "ComicbookPagesProcessPagesetUploadQueueDlq": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "ComicbookS3Bucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
  }
}