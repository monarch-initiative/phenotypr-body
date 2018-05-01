import qs from 'qs';
import axios from 'axios';

/**
 * A service that queries the Solr index.
 */
export default class SearchService {
  /**
   * @param {String} searchUrl - URL of the Solr endpoint to query.
   */
  constructor(searchUrl) {
    this.searchUrl = searchUrl;
  }

  /**
   * Constructs the URL to query the Solr index for the given terms.
   *
   * TODO: HBCA-12 escape input to Solr
   * TODO: Get feedback on query params
   *
   * @param {String} queryText - search terms to query. Required.
   * @return {String} URL with query string to use to query the index.
   * @private
   */
  _buildUrl(queryText) {
    const defaultParams = {
      df: 'exact_synonym_eng',
      fl: 'id,label,exact_synonym,score',
      wt: 'json'
    };

    const params = Object.assign({}, defaultParams, { q: queryText });
    const queryString = qs.stringify(params, { addQueryPrefix: true });

    return `${this.searchUrl}${queryString}`;
  }

  /**
   * Queries the Solr index with the given search terms.
   *
   * @param {String} queryText - search terms to query for.
   * @return {Promise -> Object} a promise. On success, resolves to data returned by
   *   the Solr query. On error, resolves an object with an error key containing the
   *   reason the request was rejected.
   */
  search(queryText) {
    const url = this._buildUrl(queryText);
    return axios(url)
      .then(response => response.data.response)
      .catch(reason => ({ error: reason }));
  }
}
