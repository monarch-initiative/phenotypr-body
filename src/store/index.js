import uuid from 'uuid/v4';

import scoringService from '@/services/scoring-service';
import DataLoggingService from '@/services/data-logging-service';

import { convertTerm } from '@/utils/persistence-utils';

const initialState = {
  sessionId: uuid(),
  termsOfUseAccepted: false,
  // categories / body systems selected by the user
  selectedSystems: [],
  // all terms selected by the user
  selectedTerms: [],
  // terms selected during initial search constrained by selected systems
  constrainedTerms: [],
  // terms selected during second search with optional filtering
  unconstrainedTerms: [],
  // whether the user found all the conditions they were searching for
  foundAllConditions: null,
  // demographics details
  demographics: null,
  // additional symptoms
  additionalSymptoms: null,
  // additional comments
  additionalComments: null,
  // annotation sufficiency state
  qualityScore: 0,
  scoringError: null
};

/**
 * Vuex store configuration.
 */
export default {
  state: initialState,

  mutations: {
    /**
     * Add a body system to the list of selected systems if it is not already present.
     * If already selected, remove the system from the the list.
     * @param {Object} state - the current state.
     * @param {Object{id: string, label: string}} system - an id/label pair representing
     *   a high-level body system in the HPO.
     */
    toggleSystem(state, system) {
      const { selectedSystems } = state;
      const index = selectedSystems.findIndex(current => current.id === system.id);
      if (index !== -1) {
        selectedSystems.splice(index, 1);
      } else {
        selectedSystems.push(system);
      }
    },

    /**
     * Add an HPO term to the selected terms if it is not already present.
     * @param {Object} state - the current state.
     * @param {Object{term: Object, filterEnabled: Boolean}} payload - an object containing
     *   the term to add and whether user filtering is enabled.
     */
    addTerm(state, { term, filterEnabled = false }) {
      const { selectedTerms, constrainedTerms, unconstrainedTerms } = state;
      const found = selectedTerms.find(current => current.id === term.id);
      if (!found) {
        selectedTerms.push(term);
        filterEnabled ? unconstrainedTerms.push(term) : constrainedTerms.push(term);
      }
    },

    /**
     * Removes the HPO term at the given index from the selected terms.
     * @param {Object} state - the current state.
     * @param {Number} index - the index of the term to remove.
     */
    removeTermAtIndex(state, index) {
      const [ removed ] = state.selectedTerms.splice(index, 1);
      ['constrainedTerms', 'unconstrainedTerms'].forEach(termArray => {
        state[termArray] = state[termArray].filter(term => term.id !== removed.id);
      });
    },

    /**
     * Sets the terms of use flag to true.
     * @param {Object} state - the current state
     */
    acceptTermsOfUse(state) {
      state.termsOfUseAccepted = true;
    },

    /**
     * Sets the quality score to the specified value.
     * @param {Object} state - the current state.
     * @param {Number} score - the quality score to set.
     */
    setQualityScore(state, score) {
      state.scoringError = null;
      state.qualityScore = score;
    },

    /**
     * Sets the scoring error to the specified value.
     * @param {Object} state - the current state.
     * @param {Error} error - the error received from the scoring service.
     */
    setScoringError(state, error) {
      state.scoringError = error;
    },

    /**
     * Sets the flag indicating whether the user found all their conditions.
     * @param {Object} state - the current state.
     * @param {Boolean} value - whether the user found all their conditions.
     */
    setFoundAllConditions(state, value) {
      state.foundAllConditions = value;
    },

    /**
     * Sets the demographic details provided by the participant
     * @param {Object} state - the current state.
     * @param {Object} value - demographic details
     */
    setDemographics(state, value) {
      state.demographics = value;
    },

    /**
     * Sets the additonal symptoms from participant
     * @param {Object} state - the current state.
     * @param {String} value - symptoms
     */
    setAdditionalSymptoms(state, value) {
      state.additionalSymptoms = value;
    },

    /**
     * Sets the additonal comments from participant
     * @param {Object} state - the current state.
     * @param {String} value - comments
     */
    setAdditionalComments(state, value) {
      state.additionalComments = value;
    }
  },

  actions: {
    /**
     * Asynchronously sends selected terms to Monarch Initiative API to calculate their
     * clinical usefulness, then adds the score to the store.
     * @param {Object} context - Vuex action context.
     * @return {Promise} a promise that resolves when the request is complete.
     */
    calculateQualityScore({ commit, state }) {
      const { selectedTerms } = state;

      if (selectedTerms.length) {
        return scoringService.score(selectedTerms)
          .then(scoreData => commit('setQualityScore', scoreData.scaled_score))
          .catch(reason => commit('setScoringError', reason));
      } else {
        return Promise.resolve(commit('setQualityScore', 0));
      }
    },

    /**
     * Asynchronously saves the session ID, selected body systems, selected terms, and
     * application feedback for research analysis.
     * @param {Object} context - Vuex action context.
     * @return {Promise} a promise that resolves when the request is complete.
     */
    saveSessionData({ commit, state }) {
      const {
        sessionId,
        selectedSystems,
        selectedTerms,
        constrainedTerms,
        unconstrainedTerms,
        foundAllConditions,
        demographics,
        additionalSymptoms,
        additionalComments,
        qualityScore
      } = state;

      const sessionData = {
        session_id: sessionId,
        selected_systems: selectedSystems.map(system => system.id),
        selected_terms: selectedTerms.map(convertTerm),
        constrained_terms: constrainedTerms.map(convertTerm),
        unconstrained_terms: unconstrainedTerms.map(convertTerm),
        found_all: foundAllConditions,
        demographics: demographics,
        additionalSymptoms: additionalSymptoms,
        additionalComments: additionalComments,
        quality_score: qualityScore
      };

      const dataLoggingService = new DataLoggingService(process.env.GENOMICS_API_ENDPOINT);
      return dataLoggingService.saveSession(sessionData);
    }
  }
};
