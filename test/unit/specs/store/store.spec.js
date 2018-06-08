import storeConfig from '@/store';
import exampleTerms from '../../example-terms';

describe('vuex store', () => {
  test('exports the initial state', () => {
    expect(storeConfig.state).toBeDefined();
    expect(storeConfig.state.selectedTerms).toEqual([]);
  });

  test('exports the mutations', () => {
    expect(storeConfig.mutations).toBeDefined();
  });

  describe('mutations', () => {
    const { mutations } = storeConfig;

    test('addTerm adds the term to the end of the array', () => {
      let term = exampleTerms[1];
      const mockState = {
        selectedTerms: []
      };

      mutations.addTerm(mockState, term);
      expect(mockState.selectedTerms.length).toEqual(1);
      expect(mockState.selectedTerms).toContain(term);

      term = exampleTerms[3];
      mutations.addTerm(mockState, term);
      expect(mockState.selectedTerms.length).toEqual(2);
      expect(mockState.selectedTerms[1]).toEqual(term);
    });

    test('addTerm prevents adding duplicate terms', () => {
      const term = exampleTerms[1];
      const mockState = {
        selectedTerms: [term]
      };

      mutations.addTerm(mockState, term);
      expect(mockState.selectedTerms.length).toEqual(1);
    });

    test('removeTermAtIndex removes the term from the array', () => {
      const expectedItem = exampleTerms[2];
      const mockState = {
        selectedTerms: [...exampleTerms]
      };

      expect(mockState.selectedTerms).toContain(expectedItem);

      mutations.removeTermAtIndex(mockState, 2);
      expect(mockState.selectedTerms.length).toEqual(exampleTerms.length - 1);
      expect(mockState.selectedTerms).not.toContain(expectedItem);
    });

    test('acceptTermsOfUse mutates termsOfUseAccepted', () => {
      const mockState = {
        termsOfUseAccepted: false
      };

      expect(mockState.termsOfUseAccepted).toBe(false);
      mutations.acceptTermsOfUse(mockState, true);
      expect(mockState.termsOfUseAccepted).toBe(true);
    });
  });
});
