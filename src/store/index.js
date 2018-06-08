import scoringService from '@/services/scoring-service';

const initialState = {
  selectedTerms: [],
  termsOfUseAccepted: false,
  qualityScore: 0
};

/**
 * Vuex store configuration.
 */
export default {
  state: initialState,

  mutations: {
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
      state.qualityScore = score;
    }
  },

  actions: {
    /**
     * Asynchronously sends selected terms to Monarch Initiative API to calculate their
     * clinical usefulness, then adds the score to the store.
     * @param {Object} context - Vuex action context.
     */
    calculateQualityScore({ commit, state }) {
      const { selectedTerms } = state;

      if (selectedTerms.length) {
        // TODO: normalize error response to a sentinel?
        return scoringService.score(selectedTerms)
          .then(scoreData => commit('setQualityScore', scoreData.scaled_score));
      } else {
        return Promise.resolve(commit('setQualityScore', 0));
      }
    }
  }
};
