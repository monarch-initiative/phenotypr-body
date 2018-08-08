import isValidTerm from '@/utils/is-valid-term';

/**
 * A service that performs HTTP requests to save the terms selected by the user.
 */
export default {
  /**
   * Verify that required request inputs were received.
   *
   * @param {String} sessionId - the UUID session identifier
   * @param {{id: string, label: string}[]} terms - an array of HPO term objects.
   */
  _validateInput(sessionId, terms) {
    if (!sessionId || typeof sessionId !== 'string') {
      throw new Error('A string session ID is required');
    }

    if (!terms || !Array.isArray(terms) || !terms.every(isValidTerm)) {
      throw new Error('An array of HPO terms is required');
    }
  },

  /**
   * Persist the user's session data.
   *
   * TODO: This is currently a stub. Implement the actual HTTP request.
   *
   * @param {String} sessionId - the UUID session identifier
   * @param {{id: string, label: string}[]} terms - an array of HPO term objects.
   * @return {Promise->Object} on success, resolves to an object. On error, the error that
   *   triggered the rejection is returned.
   */
  saveSession(sessionId, terms) {
    this._validateInput(sessionId, terms);
    const requestBody = {
      session_id: sessionId,
      selected_terms: terms.map(term => {
        return {
          id: term.id,
          label: term.label,
          symptom: term.symptomText
        };
      })
    };

    return Promise.resolve(requestBody);
  }
};
