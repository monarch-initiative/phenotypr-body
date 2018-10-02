import axios from 'axios';
import DataLoggingService from '@/services/data-logging-service';

import exampleSession from '../../example-session-data';

jest.mock('axios');

describe('data logging service', () => {
  const MOCK_ENDPOINT = 'http://example.com/save';
  let testInput, service;

  beforeEach(() => {
    axios.mockReset();
    axios.post.mockReturnValue(Promise.resolve({ data: {} }));
    testInput = Object.assign({}, exampleSession);
    service = new DataLoggingService(MOCK_ENDPOINT);
  });

  test('it validates that a session ID is provided', () => {
    const expectedMessage = 'session_id: A string session ID is required';

    // Falsy ID
    testInput.session_id = null;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);
    testInput.session_id = '';
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    // Wrong type
    testInput.session_id = 42;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    // Missing ID
    delete testInput.session_id;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);
  });

  test('it validates that a combined array of selected terms is provided', () => {
    const expectedMessage = 'selected_terms: An array of HPO terms is required';

    testInput.selected_terms = null;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.selected_terms = {};
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.selected_terms = [{ nope: 'not a term' }];
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    delete testInput.selected_terms;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);
  });

  test('it validates that constrained mode terms are provided', () => {
    const expectedMessage = 'constrained_terms: An array of HPO terms is required';

    testInput.constrained_terms = null;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.constrained_terms = {};
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.constrained_terms = [{ nope: 'not a term' }];
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    delete testInput.constrained_terms;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);
  });

  test('it validates that unconstrained mode terms are provided', () => {
    const expectedMessage = 'unconstrained_terms: An array of HPO terms is required';

    // empty array should be accepted
    testInput.unconstrained_terms = [];
    expect(() => { service.saveSession(testInput); }).not.toThrow();

    testInput.unconstrained_terms = null;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.unconstrained_terms = {};
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.unconstrained_terms = [{ nope: 'not a term' }];
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    delete testInput.unconstrained_terms;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);
  });

  test('it validates that body systems are provided', () => {
    const expectedMessage = 'selected_systems: An array of HPO IDs is required';

    testInput.selected_systems = null;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.selected_systems = {};
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.selected_systems = ['not an ID'];
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    delete testInput.selected_systems;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);
  });

  test('it validates that the feedback flag is provided', () => {
    const expectedMessage = 'found_all: Should be true or false';

    testInput.found_all = null;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.found_all = {};
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.found_all = 42;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);

    delete testInput.found_all;
    expect(() => { service.saveSession(testInput); }).toThrow(expectedMessage);
  });

  test('it posts to the persistence endpoint', () => {
    const expectedBody = { search_results: testInput };

    return service.saveSession(testInput)
      .then(() => {
        expect(axios.post).toHaveBeenCalledWith(MOCK_ENDPOINT, expectedBody);
      });
  });
});
