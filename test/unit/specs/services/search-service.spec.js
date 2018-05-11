import SearchService from '@/services/search-service';
import axios from 'axios';

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

  test('it catches error responses', () => {
    const message = 'a bad thing happened';
    axios.mockReturnValue(Promise.reject(new Error(message)));
    return service.search('some query')
      .then(response => expect(response.error.message).toEqual(message));
  });

  test('it merges highlighting into the response documents', () => {
    const mockHighlighting = {
      'HP:0000001': {
        exact_synonym_eng: [ '<em class="hilite">Flat</em> <em class="hilite">nose</em>' ],
        exact_synonym_std: [ '<em class="hilite">Flat</em> <em class="hilite">nose</em>' ]
      },
      'HP:0000042': {
        exact_synonym_eng: [ '<em class="hilite">Flat</em> foot' ],
        exact_synonym_std: [ '<em class="hilite">Flat</em> foot' ]
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

    mockQueryResponse(mockResponse);
    const expectedHighlight = mockHighlighting['HP:0000042'];
    return service.search('some query')
      .then(response => expect(response.docs[0].highlighting).toEqual(expectedHighlight));
  });
});
