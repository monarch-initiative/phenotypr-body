const initialState = {
  selectedTerms: [],
  termsOfUseAccepted: false
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

    acceptTermsOfUse(state) {
      state.termsOfUseAccepted = true;
    }
  }
};
