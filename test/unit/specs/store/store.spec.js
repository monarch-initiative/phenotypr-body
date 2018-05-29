import storeConfig from '@/store';
import exampleResponses from '../../example-responses';

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
      let term = exampleResponses[1];
      const mockState = {
        selectedTerms: []
      };

      mutations.addTerm(mockState, term);
      expect(mockState.selectedTerms.length).toEqual(1);
      expect(mockState.selectedTerms).toContain(term);

      term = exampleResponses[3];
      mutations.addTerm(mockState, term);
      expect(mockState.selectedTerms.length).toEqual(2);
      expect(mockState.selectedTerms[1]).toEqual(term);
    });

    test('addTerm prevents adding duplicate terms', () => {
      const term = exampleResponses[1];
      const mockState = {
        selectedTerms: [term]
      };

      mutations.addTerm(mockState, term);
      expect(mockState.selectedTerms.length).toEqual(1);
    });

    test('removeTermAtIndex removes the term from the array', () => {
      const expectedItem = exampleResponses[2];
      const mockState = {
        selectedTerms: [...exampleResponses]
      };

      expect(mockState.selectedTerms).toContain(expectedItem);

      mutations.removeTermAtIndex(mockState, 2);
      expect(mockState.selectedTerms.length).toEqual(exampleResponses.length - 1);
      expect(mockState.selectedTerms).not.toContain(expectedItem);
    });
  });
});
