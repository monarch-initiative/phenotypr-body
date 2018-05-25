import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

/**
 * Renders a document structure to a downloadable PDF object.
 *
 * @see https://github.com/bpampuch/pdfmake
 * @see pdf-document-builder.js
 */
export default class PdfRenderer {
  constructor() {
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    this.renderer = pdfMake;
  }

  /**
   * Returns a PDF object rendered from the given document structure.
   *
   * @param {Object} doc - a document structure created by the document builder.
   * @return {Object} a PDF object.
   */
  renderDocument(doc) {
    if (!this._isValidDocument(doc)) {
      throw new Error('Input document does not have the expected structure.');
    }

    return pdfMake.createPdf(doc);
  }

  /**
   * Reports whether the input looks like a document structure created by the document builder.
   *
   * @param {Any} doc - anything
   * @return {Boolean} true if the input is defined and has a `content` property that
   *   matches one of the types allowed by pdfmake, false otherwise.
   */
  _isValidDocument(doc) {
    return !!doc && !!doc.content && Array.isArray(doc.content);
  }
}
