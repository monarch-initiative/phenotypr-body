import uuid from 'uuid/v4';

import scoringService from '@/services/scoring-service';
import dataLoggingService from '@/services/data-logging-service';

const initialState = {
  sessionId: uuid(),
  selectedSystems: [],
  selectedTerms: [],
  foundAllConditions: null,
  termsOfUseAccepted: false,
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
     * @param {Object} term - an HPO term from Solr.
     */
    addTerm(state, term) {
      const found = state.selectedTerms.find(current => current.id === term.id);
      if (!found) {
        state.selectedTerms.push(term);
      }
    },

    /**
     * Removes the HPO term at the given index from the selected terms.
     * @param {Object} state - the current state.
     * @param {Number} index - the index of the term to remove.
     */
    removeTermAtIndex(state, index) {
      state.selectedTerms.splice(index, 1);
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
        selectedTerms,
        selectedSystems,
        foundAllConditions
      } = state;

      if (!selectedTerms.length) {
        return Promise.resolve();
      }

      return dataLoggingService.saveSession(sessionId, selectedTerms, selectedSystems, foundAllConditions);
    }
  }
};
