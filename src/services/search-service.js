import qs from 'qs';
import axios from 'axios';
import striptags from 'striptags';

const searchFields = [
  { name: 'exact_synonym_std', boost: 5 },
  { name: 'exact_synonym_kw', boost: 5 },
  { name: 'exact_synonym_eng', boost: 5 },
  { name: 'narrow_synonym_std', boost: 3 },
  { name: 'narrow_synonym_kw', boost: 3 },
  { name: 'narrow_synonym_eng', boost: 3 },
  { name: 'related_synonym_std', boost: 2 },
  { name: 'related_synonym_kw', boost: 2 },
  { name: 'related_synonym_eng', boost: 2 },
  { name: 'broad_synonym_std', boost: 1 },
  { name: 'broad_synonym_kw', boost: 1 },
  { name: 'broad_synonym_eng', boost: 1 }
];

/**
 * Sorts search fields by position in the searchFields array.
 *
 * @param {String} a - a search field name
 * @param {String} b - a search field name
 * @return 0 if `a = b`; < 0 if `a` precedes `b` in the `searchFields` array; > 0 if `a`
 *   follows `b` in the `searchFields` array.
 */
function compareSearchFields(a, b) {
  const aIndex = searchFields.findIndex(item => item.name === a);
  const bIndex = searchFields.findIndex(item => item.name === b);
  return aIndex - bIndex;
}

const defaultParams = {
  // Select all document fields, plus the score
  fl: '*,score',
  // Use the 'edismax' query parser
  defType: 'edismax',
  // Highlighting config
  hl: 'on',
  'hl.snippets': '1000',
  'hl.simple.pre': '<em class="hilite">',
  // Fields to query with boosting factors
  qf: searchFields.map(field => `${field.name}^${field.boost}`).join(' '),
  // JSON output
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
   * Adds symptom labels to each HPO term document based on highlighting information.
   *
   * The HTML and text versions of the symptom displayed to the user is determined by
   * sorting the available highlighting responses by boost factor, then taking the head
   * of the array.
   *
   * @param {Object} mergedHighlightResponse - a Solr response with highlighting merged.
   * @return {Object} an object with a `docs` key, where `docs` is an array of Solr
   *   documents with added `symptomHtml` and `symptomText` properties.
   */
  _mapSymptomLabels(mergedHighlightResponse) {
    const { docs } = mergedHighlightResponse;
    const mapped = docs.map(term => {
      const { highlighting } = term;
      const [ labelKey ] = Object.keys(highlighting).sort(compareSearchFields);
      const symptomHtml = highlighting[labelKey][0];

      return {
        ...term,
        symptomHtml,
        symptomText: striptags(symptomHtml)
      };
    });

    return {
      docs: mapped
    };
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
      .then(this._mapSymptomLabels)
      .catch(reason => ({ error: reason }));
  }
}
