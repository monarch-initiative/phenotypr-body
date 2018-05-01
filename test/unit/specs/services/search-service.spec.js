import SearchService from '@/services/search-service';
import axios from 'axios';

jest.mock('axios');

describe('search service', () => {
  const mockUrl = 'http://example.com/solr/hpo-pl/select';
  let service;

  function mockQueryResponse() {
    const mockResponse = {
      data: {
        response: {
          docs: []
        }
      }
    };

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
});
