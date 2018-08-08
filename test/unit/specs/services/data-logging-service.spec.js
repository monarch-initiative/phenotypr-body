import uuid from 'uuid/v4';
import dataLoggingService from '@/services/data-logging-service';

import exampleTerms from '../../example-terms';

const testId = uuid();

describe('data logging service', () => {
  test('it validates that a session ID is provided', () => {
    const expectedMessage = 'A string session ID is required';

    // Missing ID
    expect(() => { dataLoggingService.saveSession(); }).toThrow(expectedMessage);

    // Falsy ID
    expect(() => { dataLoggingService.saveSession(null); }).toThrow(expectedMessage);
    expect(() => { dataLoggingService.saveSession(''); }).toThrow(expectedMessage);

    // Wrong type
    expect(() => { dataLoggingService.saveSession(42); }).toThrow(expectedMessage);
  });

  test('it validates that terms are provided', () => {
    const expectedMessage = 'An array of HPO terms is required';
    expect(() => { dataLoggingService.saveSession(testId); }).toThrow(expectedMessage);
    expect(() => { dataLoggingService.saveSession(testId, null); }).toThrow(expectedMessage);
    expect(() => { dataLoggingService.saveSession(testId, {}); }).toThrow(expectedMessage);
    expect(() => { dataLoggingService.saveSession(testId, [{ nope: 'not a term' }]); }).toThrow(expectedMessage);
  });

  // TODO: when we have an endpoint to post to:
  // - verify that post occurs
  // - update request body test

  test('it constructs the request body as expected', () => {
    return dataLoggingService.saveSession(testId, exampleTerms)
      .then(response => {
        expect(response.session_id).toEqual(testId);
        expect(Array.isArray(response.selected_terms)).toBe(true);

        response.selected_terms.forEach((term, i) => {
          const sourceTerm = exampleTerms[i];
          expect(term.id).toEqual(sourceTerm.id);
          expect(term.label).toEqual(sourceTerm.label);
          expect(term.symptom).toEqual(sourceTerm.symptomText);
        });
      });
  });
});
