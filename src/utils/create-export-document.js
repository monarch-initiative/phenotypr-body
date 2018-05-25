const TABLE_PLACEHOLDER = 'TABLE_PLACEHOLDER';

const colors = {
  white: '#ffffff',
  black: '#000000',
  heading: '#355f88',
  tableHeaderCell: '#91989e',
  tableHeaderBorder: '#ddbd47',
  tableRowEven: '#f6fafc',
  tableRowOdd: '#ecf4fa'
};

/**
 * Returns the basic structure of the export document. This is a function rather than a
 * constant to ensure we get a new object every time.
 *
 * @return {Object} a pdfmake document structure with a placeholder for the table of HPO
 *   terms
 */
function createBaseDocument() {
  return {
    content: [
      { text: 'Your HPO Terms', style: 'heading' },
      '\n',
      TABLE_PLACEHOLDER
    ],
    styles: {
      heading: {
        fontSize: 16,
        bold: true,
        color: colors.heading
      },
      tableHeaderCell: {
        bold: true,
        color: colors.tableHeaderCell
      }
    }
  };
}

/**
 * Constructs a pdfmake table structure for the provided HPO terms.
 *
 * @param {Array[Object]} terms - an array of HPO term objects.
 * @return {Object} a pdfmake table structure with a row for each term.
 */
function createTermTable(terms) {
  // The header row only has a bottom border to match the Vue app
  const headerCellBorders = [false, false, false, true];

  return {
    table: {
      headerRows: 1,
      widths: ['*', '*', '*'],

      body: [
        [
          { text: 'Symptom', style: 'tableHeaderCell', border: headerCellBorders },
          { text: 'HPO Term', style: 'tableHeaderCell', border: headerCellBorders },
          { text: 'HPO #', style: 'tableHeaderCell', border: headerCellBorders }
        ],
        ...terms.map(term => [term.exact_synonym[0], term.label, term.id])
      ]
    },
    layout: {
      defaultBorder: false,
      fillColor(i, node) {
        if (i === 0) {
          return colors.white;
        } else {
          return i % 2 === 0 ? colors.tableRowEven : colors.tableRowOdd;
        }
      },
      hLineColor(i, node) {
        return i === 1 ? colors.tableHeaderBorder : colors.black;
      }
    }
  };
}

/**
 * Creates a document structure with the provided HPO terms that can be rendered to PDF.
 *
 * @param {Array[Object]} terms - an array of HPO term objects.
 * @return {Object} a document structure suitable for rendering to PDF
 * @see pdf-renderer.js
 */
export default function createExportDocument(terms) {
  if (!Array.isArray(terms) || terms.length < 1) {
    throw new Error('An array of HPO terms is required to create an export document.');
  }

  const doc = createBaseDocument();
  const termTable = createTermTable(terms);

  doc.content = doc.content.map(item => item === TABLE_PLACEHOLDER ? termTable : item);

  return doc;
}
