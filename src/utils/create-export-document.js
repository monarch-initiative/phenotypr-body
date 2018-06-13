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
  const url = window.location.origin + window.location.pathname;

  return {
    header: {
      style: 'pageHeaderOrFooter',
      columns: [
        { text: `Phenotypr Body: ${url}`, link: url, style: 'link' },
        { text: new Date().toLocaleDateString(), alignment: 'right' }
      ]
    },

    footer: (currentPage, pageCount) => {
      return {
        text: `Page ${currentPage} of ${pageCount}`,
        style: 'pageHeaderOrFooter',
        alignment: 'center'
      };
    },

    content: [
      {
        text: 'Your HPO Terms\n\n',
        style: 'heading'
      },
      {
        text: [
          'The table below shows the symptoms you selected using the ',
          { text: 'Phenotypr Body tool', link: url, style: 'link' },
          ' and the corresponding HPO terms. Knowing you or your child\'s HPO mapping can ',
          'provide your healthcare provider access to quality, structured phenotyping data. ',
          'Providing this information to your clinicians can assist in diagnosis (e.g., ',
          'there may be something your medical team doesn\'t know about!).\n\n'
        ]
      }
    ],
    styles: {
      heading: {
        fontSize: 16,
        bold: true,
        color: colors.heading
      },
      link: {
        color: colors.heading,
        decoration: 'underline'
      },
      pageHeaderOrFooter: {
        fontSize: 9,
        italic: true,
        marginLeft: 40,
        marginRight: 40,
        marginTop: 10,
        marginBottom: 10
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
        ...terms.map(term => [term.symptomText, term.label, term.id])
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
  doc.content.push(createTermTable(terms));

  return doc;
}
