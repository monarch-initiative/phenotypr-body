import qs from 'qs';
import axios from 'axios';

const defaultParams = {
  fl: '*,score',
  defType: 'edismax',
  hl: 'on',
  'hl.snippets': '1000',
  'hl.simple.pre': '<em class="hilite">',
  qf: [
    'broad_synonym_std^1',
    'broad_synonym_kw^1',
    'broad_synonym_eng^1',
    'narrow_synonym_std^3',
    'narrow_synonym_kw^3',
    'narrow_synonym_eng^3',
    'exact_synonym_std^5',
    'exact_synonym_kw^5',
    'exact_synonym_eng^5',
    'related_synonym_std^2',
    'related_synonym_kw^2',
    'related_synonym_eng^2'
  ].join(' '),
  wt: 'json'
};

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
   *
   * @param {String} queryText - search terms to query. Required.
   * @return {String} URL with query string to use to query the index.
   * @private
   */
  _buildUrl(queryText) {
    const params = Object.assign({}, defaultParams, { q: queryText });
    const queryString = qs.stringify(params, { addQueryPrefix: true });

    return `${this.searchUrl}${queryString}`;
  }

  /**
   * Merges highlighting returned from Solr with the related HPO term document.
   *
   * @param {Object} response - a Solr response.
   * @return {Object} an object with a `docs` key, where `docs` is an array of Solr
   *   documents with highlighting information added
   */
  _mergeHighlighting(response) {
    const { docs = [] } = response.response;
    const { highlighting = {} } = response;

    docs.forEach(doc => {
      doc.highlighting = highlighting[doc.id];
    });

    return { docs };
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
      .then(response => response.data)
      .then(this._mergeHighlighting)
      .catch(reason => ({ error: reason }));
  }
}
