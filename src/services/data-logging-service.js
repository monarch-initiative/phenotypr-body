/* eslint-disable camelcase */
import { isValidTerm, isValidId } from '@/utils/term-utils';
const hasSymptom = term => term.hasOwnProperty('symptom');

/**
 * A service that performs HTTP requests to save the terms selected by the user.
 */
export default {
  /**
   * Verify that the input looks like a session ID.
   *
   * @param {Any} sessionId
   */
  _validateSessionId(sessionId) {
    const valid = Boolean(sessionId && typeof sessionId === 'string');
    if (!valid) {
      throw new Error('session_id: A string session ID is required');
    }
  },

  /**
   * Verify that input looks like an array of HPO terms with symptoms.
   *
   * @param {String} propName - the name of the input object property being checked.
   * @param {Any} terms - the value of the input object property being checked.
   */
  _validateTerms(propName, terms) {
    const valid = Array.isArray(terms) && terms.every(isValidTerm) &&
      terms.every(hasSymptom);
    if (!valid) {
      throw new Error(`${propName}: An array of HPO terms is required`);
    }
  },

  /**
   * Verify that input looks like an array of HPO IDs.
   *
   * @param {Any} systems
   */
  _validateSystems(systems) {
    const valid = Array.isArray(systems) && systems.every(isValidId);
    if (!valid) {
      throw new Error('selected_systems: An array of HPO IDs is required');
    }
  },

  /**
   * Verify that input looks like a boolean flag.
   *
   * @param {Any} flag
   */
  _validateFoundAllFlag(flag) {
    const valid = typeof flag === 'boolean';
    if (!valid) {
      throw new Error('found_all: Should be true or false');
    }
  },

  /**
   * Verify that required request inputs were received.
   *
   * @param {Object} data - the input object.
   */
  _validateInput(data) {
    const { session_id, selected_systems, found_all } = data;
    const termArrays = ['selected_terms', 'constrained_terms', 'unconstrained_terms'];

    this._validateSessionId(session_id);
    this._validateSystems(selected_systems);
    this._validateFoundAllFlag(found_all);

    termArrays.forEach(arrayName => this._validateTerms(arrayName, data[arrayName]));
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
