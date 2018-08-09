import dataLoggingService from '@/services/data-logging-service';

import exampleSession from '../../example-session-data';

describe('data logging service', () => {
  let testInput;

  beforeEach(() => {
    testInput = Object.assign({}, exampleSession);
  });

  test('it validates that a session ID is provided', () => {
    const expectedMessage = 'session_id: A string session ID is required';

    // Falsy ID
    testInput.session_id = null;
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);
    testInput.session_id = '';
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);

    // Wrong type
    testInput.session_id = 42;
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);

    // Missing ID
    delete testInput.session_id;
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);
  });

  test('it validates that terms are provided', () => {
    const expectedMessage = 'selected_terms: An array of HPO terms is required';

    testInput.selected_terms = null;
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.selected_terms = {};
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.selected_terms = [{ nope: 'not a term' }];
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);

    delete testInput.selected_terms;
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);
  });

  test('it validates that body systems are provided', () => {
    const expectedMessage = 'selected_systems: An array of HPO IDs is required';

    testInput.selected_systems = null;
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.selected_systems = {};
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.selected_systems = ['not an ID'];
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);

    delete testInput.selected_systems;
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);
  });

  test('it validates that the feedback flag is provided', () => {
    const expectedMessage = 'found_all: Should be true or false';

    testInput.found_all = null;
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.found_all = {};
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);

    testInput.found_all = 42;
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);

    delete testInput.found_all;
    expect(() => { dataLoggingService.saveSession(testInput); }).toThrow(expectedMessage);
  });

  // TODO: when we have an endpoint to post to:
  // - verify that post occurs
  // - update request body test

  test('it constructs the request body as expected', () => {
    return dataLoggingService.saveSession(testInput)
      .then(response => {
        expect(response).toEqual(testInput);
      });
  });
});
