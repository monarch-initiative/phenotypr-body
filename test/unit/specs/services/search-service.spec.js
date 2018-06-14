import SearchService from '@/services/search-service';
import axios from 'axios';
import striptags from 'striptags';

jest.mock('axios');

describe('search service', () => {
  const mockUrl = 'http://example.com/solr/hpo-pl/select';

  const defaultMockResponse = {
    data: {
      response: {
        docs: []
      }
    }
  };

  let service;

  function mockQueryResponse(mockResponse = defaultMockResponse) {
    axios.mockReturnValue(Promise.resolve(mockResponse));
  }

  beforeEach(() => {
    axios.mockReset();
    service = new SearchService(mockUrl);
  });

  test('it delegates querying to axios', () => {
    mockQueryResponse();
    service.search('mock query');
    expect(axios).toHaveBeenCalled();
  });

  test('it constructs the URL and query string as expected', () => {
    mockQueryResponse();
    service.search('plain language terms');
    expect(axios).toHaveBeenCalled();
    const searchUrl = axios.mock.calls[0][0];
    const queryString = searchUrl.split('?')[1];
    expect(searchUrl.startsWith(mockUrl)).toBe(true);
    expect(queryString).toMatch('q=plain%20language%20terms');
  });

  test('clients must handle error responses', () => {
    const message = 'a bad thing happened';
    axios.mockReturnValue(Promise.reject(new Error(message)));
    return service.search('some query')
      .catch(reason => expect(reason.message).toEqual(message));
  });

  describe('response manipulation', () => {
    const mockHighlighting = {
      'HP:0000001': {
        exact_synonym_eng: [ '<em class="hilite">Flat</em> <em class="hilite">nose</em>' ],
        exact_synonym_std: [ '<em class="hilite">Flat</em> <em class="hilite">nose</em>' ]
      },
      'HP:0000042': {
        narrow_synonym_eng: [ '<em class="hilite">Flat</em> foot' ],
        narrow_synonym_std: [ '<em class="hilite">Flat</em> foot' ]
      }
    };

    const mockResponse = {
      data: {
        response: {
          docs: [
            { id: 'HP:0000042' },
            { id: 'HP:0000001' }
          ]
        },
        highlighting: mockHighlighting
      }
    };

    test('it merges highlighting into the response documents', () => {
      mockQueryResponse(mockResponse);
      const expectedHighlight = mockHighlighting['HP:0000042'];
      return service.search('some query')
        .then(response => expect(response.docs[0].highlighting).toEqual(expectedHighlight));
    });

    test('it creates symptom labels from highlighting', () => {
      const expectedHtml = [
        mockHighlighting['HP:0000042'].narrow_synonym_std[0],
        mockHighlighting['HP:0000001'].exact_synonym_eng[0]
      ];

      mockQueryResponse(mockResponse);
      return service.search('some query')
        .then(response => {
          response.docs.forEach((doc, index) => {
            expect(doc.symptomHtml).toEqual(expectedHtml[index]);
            expect(doc.symptomText).toEqual(striptags(expectedHtml[index]));
          });
        });
    });
  });
});
