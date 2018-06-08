import axios from 'axios';

const SCORING_URL = 'https://monarchinitiative.org/score';

const termIsValid = (term) => term.id && term.label && /HP:\d{7}/.test(term.id);

/**
 * Uses the Monarch Initiative API for annotation sufficiency scoring.
 */
export default {
  /**
   * Gets an annotation sufficiency score for the selected HPO terms.
   *
   * @param {{id: string, label: string}} terms - an array of HPO term objects.
   * @return {Promise->Object} an object with annotation sufficiency scores.
   * @see example-score.js for an example response
   */
  score(terms) {
    if (!terms || !Array.isArray(terms) || !terms.every(termIsValid)) {
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

    const phenotypes = JSON.stringify({ features });

    return axios.post(SCORING_URL, { annotation_profile: phenotypes })
      .then(response => response.data)
      .catch(reason => ({ error: reason }));
  }
};
