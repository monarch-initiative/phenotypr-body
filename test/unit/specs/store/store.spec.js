import storeConfig from '@/store';
import scoringService from '@/services/scoring-service';
import exampleTerms from '../../example-terms';

jest.mock('@/services/scoring-service', () => {
  return {
    score: jest.fn()
  };
});

describe('vuex store', () => {
  test('exports the initial state', () => {
    expect(storeConfig.state).toBeDefined();
    expect(storeConfig.state.selectedTerms).toEqual([]);
  });

  test('exports the mutations', () => {
    expect(storeConfig.mutations).toBeDefined();
  });

  test('exports the actions', () => {
    expect(storeConfig.actions).toBeDefined();
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
      mutations.acceptTermsOfUse(mockState);
      expect(mockState.termsOfUseAccepted).toBe(true);
    });

    test('setQualityScore sets the specified score value', () => {
      const mockState = {
        qualityScore: null
      };

      const expectedScore = 0.42;

      mutations.setQualityScore(mockState, expectedScore);
      expect(mockState.qualityScore).toEqual(expectedScore);
    });
  });

  describe('actions', () => {
    const { actions } = storeConfig;

    beforeEach(() => {
      scoringService.score.mockReset();
    });

    test('calculateQualityScore: when terms are selected', () => {
      const commit = jest.fn();

      const mockState = {
        selectedTerms: exampleTerms.slice(0, 1)
      };

      const mockResponse = {
        scaled_score: 1.42
      };

      scoringService.score.mockReturnValueOnce(Promise.resolve(mockResponse));

      return actions.calculateQualityScore({ commit, state: mockState })
        .then(() => {
          // It should call the service
          expect(scoringService.score).toHaveBeenCalledWith(mockState.selectedTerms);

          // It commits the quality score
          expect(commit).toHaveBeenCalledWith('setQualityScore', mockResponse.scaled_score);
        });
    });

    test('calculateQualityScore: when no terms are selected', () => {
      const commit = jest.fn();

      const mockState = {
        selectedTerms: []
      };

      return actions.calculateQualityScore({ commit, state: mockState })
        .then(() => {
          // It should skip calling the service
          expect(scoringService.score).not.toHaveBeenCalled();

          // It resets the quality score
          expect(commit).toHaveBeenCalledWith('setQualityScore', 0);
        });
    });
  });
});
