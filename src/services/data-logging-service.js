/* eslint-disable camelcase */
import { isValidTerm, isValidId } from '@/utils/term-utils';

/**
 * A service that performs HTTP requests to save the terms selected by the user.
 */
export default {
  /**
   * Verify that required request inputs were received.
   *
   * @param {Object} data - the input object.
   */
  _validateInput(data) {
    const { session_id, selected_terms, selected_systems, found_all } = data;

    if (!session_id || typeof session_id !== 'string') {
      throw new Error('session_id: A string session ID is required');
    }

    if (!Array.isArray(selected_terms) || !selected_terms.every(isValidTerm)) {
      throw new Error('selected_terms: An array of HPO terms is required');
    }

    if (!Array.isArray(selected_systems) || !selected_systems.every(isValidId)) {
      throw new Error('selected_systems: An array of HPO IDs is required');
    }

    if (found_all !== true && found_all !== false) {
      throw new Error('found_all: Should be true or false');
    }
  },

  /**
   * Persist the user's session data.
   *
   * TODO: This is currently a stub. Implement the actual HTTP request.
   *
   * @param {Object} data - session data object with the following shape:
   * @param {String} data.session_id - the UUID session identifier
   * @param {String[]} data.selected_systems - an array of HPO term IDs for the high-level
   *   body systems selected by the user.
   * @param {{id: string, label: string}[]} data.selected_terms - an array of HPO term
   *   objects for the conditions selected by the user.
   * @param {Boolean} data.found_all - a boolean indicating whether the user was able to
   *   find all the conditions they searched for.
   * @return {Promise->Object} on success, resolves to an object. On error, the error that
   *   triggered the rejection is returned.
   */
  saveSession(data) {
    this._validateInput(data);
    return Promise.resolve(data);
  }
};
