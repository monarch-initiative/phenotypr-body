import isExportDocument from '@/utils/is-export-document';

describe('isExportDocument utility', () => {
  test('is false when undefined', () => {
    expect(isExportDocument()).toBe(false);
    expect(isExportDocument(undefined)).toBe(false);
  });

  test('is false for null', () => {
    expect(isExportDocument(null)).toBe(false);
  });

  test('is false if the document is malformed', () => {
    // missing property
    expect(isExportDocument({})).toBe(false);

    // wrong property type
    expect(isExportDocument({ content: 'barp' })).toBe(false);
  });

  test('is true if the document has the expected structure', () => {
    expect(isExportDocument({ content: [] })).toBe(true);
  });
});
