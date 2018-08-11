import { convertTerm } from '@/utils/persistence-utils';

import exampleTerms from '../../example-terms';

describe('convertTerm', () => {
  test('it reshapes terms returned by the search service', () => {
    const converted = exampleTerms.map(convertTerm);

    exampleTerms.forEach((term, idx) => {
      // structure is reduced to id, label, and symptom
      expect(Object.keys(converted[idx]).length).toEqual(3);

      expect(converted[idx].id).toEqual(term.id);
      expect(converted[idx].label).toEqual(term.label);

      // symptomText is renamed to symptom
      expect(converted[idx].symptom).toEqual(term.symptomText);
    });
  });
});
