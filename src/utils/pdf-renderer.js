import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

import isExportDocument from '@/utils/is-export-document';

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
    if (!isExportDocument(doc)) {
      throw new Error('Input document does not have the expected structure.');
    }

    return pdfMake.createPdf(doc);
  }
}
