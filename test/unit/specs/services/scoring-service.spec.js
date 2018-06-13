import axios from 'axios';
import scoringService from '@/services/scoring-service';

import exampleTerms from '../../example-terms';
import exampleScore from '../../example-score';

jest.mock('axios');

describe('scoring service', () => {
  const defaultMockResponse = {
    data: exampleScore
  };

  function mockQueryResponse(mockResponse = defaultMockResponse) {
    axios.post.mockReturnValue(Promise.resolve(mockResponse));
  }

  beforeEach(() => {
    axios.mockReset();
  });

  test('it validates that terms are provided', () => {
    const expectedMessage = 'An array of HPO terms is required';
    expect(() => { scoringService.score(); }).toThrow(expectedMessage);
    expect(() => { scoringService.score(null); }).toThrow(expectedMessage);
    expect(() => { scoringService.score({}); }).toThrow(expectedMessage);
    expect(() => { scoringService.score([{ nope: 'not a term' }]); }).toThrow(expectedMessage);
  });

  test('it delegates HTTP requests to axios', () => {
    mockQueryResponse();
    scoringService.score(exampleTerms);
    expect(axios.post).toHaveBeenCalled();
  });

  test('it constructs the request as expected', () => {
    mockQueryResponse();
    scoringService.score(exampleTerms);

    // it calls the API with the expected parameters
    const [ url, data ] = axios.post.mock.calls[0];
    expect(url).toMatch('monarchinitiative.org/score');
    expect(data.annotation_profile).toBeDefined();

    // annotation_profile is JSON encoded
    const parsedProfile = JSON.parse(data.annotation_profile);
    expect(parsedProfile).toBeTruthy();

    // each feature in the profile has the expected structure
    parsedProfile.features.forEach((term, index) => {
      expect(term.id).toEqual(exampleTerms[index].id);
      expect(term.label).toEqual(exampleTerms[index].label);
      expect(term.observed).toEqual('positive');
      expect(term.isPresent).toBe(true);
    });
  });

  test('clients must handle error responses', () => {
    const message = 'a bad thing happened';
    axios.post.mockReturnValue(Promise.reject(new Error(message)));
    return scoringService.score(exampleTerms)
      .catch(reason => expect(reason.message).toEqual(message));
  });
});
