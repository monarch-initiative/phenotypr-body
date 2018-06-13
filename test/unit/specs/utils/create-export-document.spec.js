import isExportDocument from '@/utils/is-export-document';
import createExportDocument from '@/utils/create-export-document';

import exampleTerms from '../../example-terms';

describe('createExportDocument utility', () => {
  test('requires an array of terms', () => {
    const expectedError = 'An array of HPO terms is required to create an export document.';

    // not an array
    expect(() => createExportDocument(null)).toThrow(expectedError);

    // empty array
    expect(() => createExportDocument([])).toThrow(expectedError);
  });

  describe('output document', () => {
    const tableFilter = node => typeof node.table === 'object';
    let doc;

    beforeEach(() => {
      doc = createExportDocument(exampleTerms);
    });

    test('overall structure is correct', () => {
      expect(isExportDocument(doc)).toBe(true);
    });

    test('contains a header and footer', () => {
      expect(doc.header).toBeTruthy();
      expect(doc.footer).toBeTruthy();
    });

    test('contains a single table', () => {
      const [ tableNode, ...rest ] = doc.content.filter(tableFilter);
      expect(tableNode).toBeTruthy();
      expect(rest.length).toEqual(0);
    });

    test('table contains a row for each HPO term', () => {
      const [ tableNode ] = doc.content.filter(tableFilter);
      const { table } = tableNode;
      expect(table.body.length).toEqual(exampleTerms.length + table.headerRows);

      const tableBody = table.body.slice(table.headerRows);
      for (let i = 0; i < exampleTerms.length; i++) {
        const [ symptom, hpoTerm, hpoId ] = tableBody[i];
        const term = exampleTerms[i];

        expect(symptom).toEqual(term.symptomText);
        expect(hpoTerm).toEqual(term.label);
        expect(hpoId).toEqual(term.id);
      }
    });
  });
});
