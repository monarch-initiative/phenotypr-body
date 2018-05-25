/**
 * Reports whether the input looks like a document structure created by the document builder.
 *
 * @param {Any} doc - anything
 * @return {Boolean} true if the input is defined and has a `content` property that
 *   matches one of the types allowed by pdfmake, false otherwise.
 */
export default function isExportDocument(doc) {
  return !!doc && !!doc.content && Array.isArray(doc.content);
}
