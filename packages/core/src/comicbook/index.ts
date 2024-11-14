import { getPublisherById as _getPublisherById } from './dynamodb/get-publisher-by-id';
import { getPublisherBySlug as _getPublisherBySlug } from './dynamodb/get-publisher-by-slug';
import { getPublisherByTitle as _getPublisherByTitle } from './dynamodb/get-publisher-by-title';
import { putPublisher as _putPublisher } from './dynamodb/put-publisher';
import { queryPublishers as _queryPublishers } from './dynamodb/query-publishers';

import { getSeriesById as _getSeriesById } from './dynamodb/get-series-by-id';
import { getSeriesBySlug as _getSeriesBySlug } from './dynamodb/get-series-by-slug';
import { getSeriesByTitle as _getSeriesByTitle } from './dynamodb/get-series-by-title';
import { putSeries as _putSeries } from './dynamodb/put-series';
import { querySeriesByPublisherId as _querySeriesByPublisherId } from './dynamodb/query-series-by-publisher-id';
import { querySeriesByReleaseWeek as _querySeriesByReleaseWeek } from './dynamodb/query-series-by-release-week';

import { deleteIssuePagesetId as _deleteIssuePagesetId } from './dynamodb/delete-issue-pageset-id';
import { getIssueById as _getIssueById } from './dynamodb/get-issue-by-id';
import { getIssueBySlug as _getIssueBySlug } from './dynamodb/get-issue-by-slug';
import { getIssueByTitle as _getIssueByTitle } from './dynamodb/get-issue-by-title';
import { putIssue as _putIssue } from './dynamodb/put-issue';
import { queryIssuesByReleaseWeek as _queryIssuesByReleaseWeek } from './dynamodb/query-issues-by-release-week';
import { queryIssuesBySeriesId as _queryIssuesBySeriesId } from './dynamodb/query-issues-by-series-id';
import { updateIssuePagesetId as _updateIssuePagesetId } from './dynamodb/update-issue-pageset-id';

import { deletePageset as _deletePageset } from './dynamodb/delete-pageset';
import { getPagesetById as _getPagesetById } from './dynamodb/get-pageset-by-id';
import { putPageset as _putPageset } from './dynamodb/put-pageset';
import { queryPagesetsByIssueId as _queryPagesetsByIssueId } from './dynamodb/query-pagesets-by-issue-id';
import { updatePagesetStatus as _updatePagesetStatus } from './dynamodb/update-pageset-status';

import { deletePagesetUpload as _deletePagesetUpload } from './s3/delete-pageset-upload';
import { getPagesetUpload as _getPagesetUpload } from './s3/get-pageset-upload';
import { signPagesetUploadUrl as _signPagesetUploadUrl } from './s3/sign-pageset-upload-url';

import { getPagesetArchive as _getPagesetArchive } from './s3/get-pageset-archive';
import { putPagesetArchive as _putPagesetArchive } from './s3/put-pageset-archive';

import { getPagesetPage as _getPagesetPage } from './s3/get-pageset-page';
import { putPagesetPage as _putPagesetPage } from './s3/put-pageset-page';

import { deletePagesetContents as _deletePagesetContents } from './s3/delete-pageset-contents';

import { getPagesetPageThumbnail as _getPagesetPageThumbnail } from './s3/get-pageset-page-thumbnail';
import { putPagesetPageThumbnail as _putPagesetPageThumbnail } from './s3/put-pageset-page-thumbnail';

import { createPagesetArchive as _createPagesetArchive } from './artifacts/create-pageset-archive';
import { createPagesetPageThumbnail as _createPagesetPageThumbnail } from './artifacts/create-pageset-page-thumbnail';

import { createPublisher as _createPublisherApi } from './api/create-publisher';
import { getPublisherById as _getPublisherByIdApi } from './api/get-publisher-by-id';
import { getPublisherBySlug as _getPublisherBySlugApi } from './api/get-publisher-by-slug';
import { getPublisherByTitle as _getPublisherByTitleApi } from './api/get-publisher-by-title';
import { listPublishers as _listPublishersApi } from './api/list-publishers';

import { createSeries as _createSeriesApi } from './api/create-series';
import { getSeriesById as _getSeriesByIdApi } from './api/get-series-by-id';
import { getSeriesBySlug as _getSeriesBySlugApi } from './api/get-series-by-slug';
import { getSeriesByTitle as _getSeriesByTitleApi } from './api/get-series-by-title';
import { listSeriesByPublisherId as _listSeriesByPublisherIdApi } from './api/list-series-by-publisher-id';
import { listSeriesByReleaseWeek as _listSeriesByReleaseWeekApi } from './api/list-series-by-release-week';

import { createIssue as _createIssueApi } from './api/create-issue';
import { getIssueById as _getIssueByIdApi } from './api/get-issue-by-id';
import { getIssueBySlug as _getIssueBySlugApi } from './api/get-issue-by-slug';
import { getIssueByTitle as _getIssueByTitleApi } from './api/get-issue-by-title';
import { listIssuesByReleaseWeek as _listIssuesByReleaseWeekApi } from './api/list-issues-by-release-week';
import { listIssuesBySeriesId as _listIssuesBySeriesIdApi } from './api/list-issues-by-series-id';
import { updateIssuePagesetId as _updateIssuePagesetIdApi } from './api/update-issue-pageset-id';

import { createPageset as _createPagesetApi } from './api/create-pageset';
import { deletePageset as _deletePagesetApi } from './api/delete-pageset';
import { getPagesetById as _getPagesetByIdApi } from './api/get-pageset-by-id';
import { listPagesetsByIssueId as _listPagesetsByIssueIdApi } from './api/list-pagesets-by-issue-id';

export namespace Comicbook {
	export namespace Dynamodb {
		export type Publisher = import('./dynamodb/types/publisher').Publisher;
		export type Series = import('./dynamodb/types/series').Series;
		export type Issue = import('./dynamodb/types/issue').Issue;
		export type Pageset = import('./dynamodb/types/pageset').Pageset;

		export const getPublisherById = _getPublisherById;
		export const getPublisherBySlug = _getPublisherBySlug;
		export const getPublisherByTitle = _getPublisherByTitle;
		export const queryPublishers = _queryPublishers;
		export const putPublisher = _putPublisher;

		export const getSeriesById = _getSeriesById;
		export const getSeriesBySlug = _getSeriesBySlug;
		export const getSeriesByTitle = _getSeriesByTitle;
		export const querySeriesByPublisherId = _querySeriesByPublisherId;
		export const querySeriesByReleaseWeek = _querySeriesByReleaseWeek;
		export const putSeries = _putSeries;

		export const getIssueById = _getIssueById;
		export const getIssueBySlug = _getIssueBySlug;
		export const getIssueByTitle = _getIssueByTitle;
		export const queryIssuesBySeriesId = _queryIssuesBySeriesId;
		export const queryIssuesByReleaseWeek = _queryIssuesByReleaseWeek;
		export const putIssue = _putIssue;
		export const updateIssuePagesetId = _updateIssuePagesetId;
		export const deleteIssuePagesetId = _deleteIssuePagesetId;

		export const getPagesetById = _getPagesetById;
		export const queryPagesetsByIssueId = _queryPagesetsByIssueId;
		export const putPageset = _putPageset;
		export const updatePagesetStatus = _updatePagesetStatus;
		export const deletePageset = _deletePageset;
	}

	export namespace S3 {
		export namespace PagesetUpload {
			// biome-ignore format: <explanation>
			export type Metadata = import('./s3/types/pageset-upload').PagesetUploadMetadata;
		}
		export namespace PagesetArchive {
			// biome-ignore format: <explanation>
			export type Metadata = import('./s3/types/pageset-archive').PagesetArchiveMetadata;
		}
		export namespace PagesetPage {
			// biome-ignore format: <explanation>
			export type Metadata = import('./s3/types/pageset-page').PagesetPageMetadata;
		}
		export namespace PagesetPageThumbnail {
			// biome-ignore format: <explanation>
			export type Metadata = import('./s3/types/pageset-page-thumbnail').PagesetPageThumbnailMetadata;
		}

		export const getPagesetUpload = _getPagesetUpload;
		export const signPagesetUploadUrl = _signPagesetUploadUrl;
		export const deletePagesetUpload = _deletePagesetUpload;

		export const getPagesetArchive = _getPagesetArchive;
		export const putPagesetArchive = _putPagesetArchive;

		export const getPagesetPage = _getPagesetPage;
		export const putPagesetPage = _putPagesetPage;

		export const getPagesetPageThumbnail = _getPagesetPageThumbnail;
		export const putPagesetPageThumbnail = _putPagesetPageThumbnail;

		export const deletePagesetContents = _deletePagesetContents;
	}

	export namespace Artifacts {
		export const createPagesetArchive = _createPagesetArchive;
		export const createPagesetPageThumbnail = _createPagesetPageThumbnail;
	}

	export namespace Api {
		export type Publisher = import('./api/types/publisher').Publisher;
		export type Series = import('./api/types/series').Series;
		export type Issue = import('./api/types/issue').Issue;
		export type Pageset = import('./api/types/pageset').Pageset;

		export const getPublisherById = _getPublisherByIdApi;
		export const getPublisherBySlug = _getPublisherBySlugApi;
		export const getPublisherByTitle = _getPublisherByTitleApi;
		export const listPublishers = _listPublishersApi;
		export const createPublisher = _createPublisherApi;

		export const getSeriesById = _getSeriesByIdApi;
		export const getSeriesBySlug = _getSeriesBySlugApi;
		export const getSeriesByTitle = _getSeriesByTitleApi;
		export const listSeriesByPublisherId = _listSeriesByPublisherIdApi;
		export const listSeriesByReleaseWeek = _listSeriesByReleaseWeekApi;
		export const createSeries = _createSeriesApi;

		export const getIssueById = _getIssueByIdApi;
		export const getIssueBySlug = _getIssueBySlugApi;
		export const getIssueByTitle = _getIssueByTitleApi;
		export const listIssuesBySeriesId = _listIssuesBySeriesIdApi;
		export const listIssuesByReleaseWeek = _listIssuesByReleaseWeekApi;
		export const createIssue = _createIssueApi;
		export const updateIssuePagesetId = _updateIssuePagesetIdApi;

		export const getPagesetById = _getPagesetByIdApi;
		export const listPagesetsByIssueId = _listPagesetsByIssueIdApi;
		export const createPageset = _createPagesetApi;
		export const deletePageset = _deletePagesetApi;
	}
}
