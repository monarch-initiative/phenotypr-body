import axios from 'axios';
import isValidTerm from '@/utils/is-valid-term';

const SCORING_URL = 'https://monarchinitiative.org/score';

/**
 * Uses the Monarch Initiative API for annotation sufficiency scoring.
 */
export default {
  /**
   * Gets an annotation sufficiency score for the selected HPO terms.
   *
   * @param {{id: string, label: string}[]} terms - an array of HPO term objects.
   * @return {Promise->Object} on success, resolves to an object with annotation
   *   sufficiency scores. On error, the error that triggered the rejection is returned.
   * @see example-score.js for an example response
   */
  score(terms) {
    if (!terms || !Array.isArray(terms) || !terms.every(isValidTerm)) {
      throw new Error('An array of HPO terms is required');
    }

    const features = terms.map(term => {
      return {
        id: term.id,
        label: term.label,
        observed: 'positive',
        isPresent: true
      };
    });

    const data = { annotation_profile: JSON.stringify({ features }) };
    const options = { timeout: 5000 };

    return axios.post(SCORING_URL, data, options)
      .then(response => response.data);
  }
};
