import pdfMake from 'pdfmake/build/pdfmake';
import PdfRenderer from '@/utils/pdf-renderer';

jest.mock('pdfmake/build/pdfmake');

describe('PdfRenderer', () => {
  test('renderDocument() requires a correctly-structured document', () => {
    const renderer = new PdfRenderer();
    const expectedMessage = 'Input document does not have the expected structure.';

    // undefined
    expect(() => renderer.renderDocument()).toThrow(expectedMessage);

    // null
    expect(() => renderer.renderDocument(null)).toThrow(expectedMessage);

    // malformed
    expect(() => renderer.renderDocument({})).toThrow(expectedMessage);
  });

  test('renderDocument() triggers createPdf()', () => {
    const mockDocument = { content: [] };
    const renderer = new PdfRenderer();
    renderer.renderDocument(mockDocument);

    expect(pdfMake.createPdf).toBeCalledWith(mockDocument);
  });
});
