import storeConfig from '@/store';
import bodySystems from '@/store/systems';

import scoringService from '@/services/scoring-service';
import dataLoggingService from '@/services/data-logging-service';

import exampleTerms from '../../example-terms';

jest.mock('@/services/scoring-service', () => {
  return {
    score: jest.fn()
  };
});

jest.mock('@/services/data-logging-service', () => {
  return {
    saveSession: jest.fn()
  };
});

describe('vuex store', () => {
  test('exports the initial state', () => {
    expect(storeConfig.state).toBeDefined();

    const { state } = storeConfig;
    const uuidPattern = /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/i;
    expect(state.selectedSystems).toEqual([]);
    expect(state.selectedTerms).toEqual([]);
    expect(state.termsOfUseAccepted).toEqual(false);
    expect(state.qualityScore).toEqual(0);
    expect(state.scoringError).toBeNull();
    expect(state.sessionId).toMatch(uuidPattern);
    expect(state.foundAllConditions).toBeNull();
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

    test('setQualityScore clears any scoring error', () => {
      const mockState = {
        qualityScore: null,
        scoringError: new Error('timeout of 10000ms exceeded')
      };

      mutations.setQualityScore(mockState, 0.42);
      expect(mockState.scoringError).toBeNull();
    });

    test('setScoringError captures the error', () => {
      const expectedError = new Error('a bad thing happened');

      const mockState = {
        scoringError: null
      };

      mutations.setScoringError(mockState, expectedError);
      expect(mockState.scoringError).toEqual(expectedError);
    });

    test('toggleSystem: when system is not already selected', () => {
      let system = { id: 'HP:0002664', label: 'Cancer' };
      const mockState = {
        selectedSystems: []
      };

      mutations.toggleSystem(mockState, system);
      expect(mockState.selectedSystems.length).toEqual(1);
      expect(mockState.selectedSystems).toContain(system);

      system = { id: 'HP:0000818', label: 'Hormone / Endocrine' };
      mutations.toggleSystem(mockState, system);
      expect(mockState.selectedSystems.length).toEqual(2);
      expect(mockState.selectedSystems[1]).toEqual(system);
    });

    test('toggleSystem: when system is already selected', () => {
      const mockState = {
        selectedSystems: [
          { id: 'HP:0002664', label: 'Cancer' },
          { id: 'HP:0000818', label: 'Hormone / Endocrine' }
        ]
      };

      let system = mockState.selectedSystems[1];
      mutations.toggleSystem(mockState, system);
      expect(mockState.selectedSystems.length).toEqual(1);
      expect(mockState.selectedSystems).not.toContain(system);
    });

    test('setFoundAllConditions sets the specified value', () => {
      const mockState = {
        foundAllConditions: null
      };

      // the flag starts out null
      expect(mockState.foundAllConditions).toBeNull();

      // the flag can be set to true
      mutations.setFoundAllConditions(mockState, true);
      expect(mockState.foundAllConditions).toBe(true);

      // the flag can be set to false
      mutations.setFoundAllConditions(mockState, false);
      expect(mockState.foundAllConditions).toBe(false);
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

    test('calculateQualityScore: when an error occurs', () => {
      const commit = jest.fn();

      const mockState = {
        selectedTerms: exampleTerms.slice(0, 1)
      };

      const scoringError = new Error('timeout of 10000ms exceeded');

      scoringService.score.mockReturnValueOnce(Promise.reject(scoringError));

      return actions.calculateQualityScore({ commit, state: mockState })
        .then(() => {
          expect(commit).toHaveBeenCalledWith('setScoringError', scoringError);
        });
    });

    test('saveSessionData: does nothing when no terms are selected', () => {
      const commit = jest.fn();

      const mockState = {
        sessionId: '00000000-0000-0000-0000-000000000000',
        selectedTerms: [],
        selectedSystems: [],
        foundAllConditions: false
      };

      return actions.saveSessionData({ commit, state: mockState })
        .then(() => {
          expect(commit).not.toHaveBeenCalled();
          expect(dataLoggingService.saveSession).not.toHaveBeenCalled();
        });
    });

    test('saveSessionData: when terms have been selected', () => {
      const commit = jest.fn();

      const mockState = {
        sessionId: '00000000-0000-0000-0000-000000000000',
        selectedTerms: exampleTerms.slice(0, 1),
        selectedSystems: bodySystems.slice(0, 1).map(system => system.id),
        foundAllConditions: true
      };

      dataLoggingService.saveSession.mockReturnValueOnce(Promise.resolve());

      return actions.saveSessionData({ commit, state: mockState })
        .then(() => {
          // No mutations should be committed
          expect(commit).not.toHaveBeenCalled();

          const { sessionId, selectedTerms, selectedSystems, foundAllConditions } = mockState;
          expect(dataLoggingService.saveSession)
            .toHaveBeenCalledWith(sessionId, selectedTerms, selectedSystems, foundAllConditions);
        });
    });
  });
});
