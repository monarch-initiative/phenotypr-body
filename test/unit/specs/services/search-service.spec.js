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

  test('clients must handle error responses', () => {
    const message = 'a bad thing happened';
    axios.mockReturnValue(Promise.reject(new Error(message)));
    return service.search('some query')
      .catch(reason => expect(reason.message).toEqual(message));
  });

  describe('request construction', () => {
    test('the search URL is prepended to the query', () => {
      mockQueryResponse();
      service.search('example');
      expect(axios).toHaveBeenCalled();
      const searchUrl = axios.mock.calls[0][0];
      expect(searchUrl.startsWith(mockUrl)).toBe(true);
    });

    test('it adds search terms to the q parameter', () => {
      mockQueryResponse();
      service.search('plain language terms');
      expect(axios).toHaveBeenCalled();
      const searchUrl = axios.mock.calls[0][0];
      const queryString = searchUrl.split('?')[1];
      expect(queryString).toMatch(
        'plain%20language%20terms%20%2B%20%22plain%20language%20terms%22'
      );
    });

    test('it adds selected high level terms to the fq parameter', () => {
      const expectedFilter = [
        'fq=phenotype_closure%3A%22HP%3A0000077%22%20OR%20',
        'phenotype_closure%3A%22HP%3A0003011%22%20OR%20',
        'phenotype_closure%3A%22HP%3A0000951%22%20OR%20' +
        'phenotype_closure%3A%22HP%3A0025142%22'
      ].join('');

      mockQueryResponse();
      service.search('other terms', ['HP:0000077', 'HP:0003011', 'HP:0000951']);
      expect(axios).toHaveBeenCalled();
      const searchUrl = axios.mock.calls[0][0];
      const queryString = searchUrl.split('?')[1];
      expect(queryString).toMatch(expectedFilter);
    });

    test('it does not add fq parameter if no filter terms are provided', () => {
      mockQueryResponse();
      service.search('no filter search');
      expect(axios).toHaveBeenCalled();
      const searchUrl = axios.mock.calls[0][0];
      const queryString = searchUrl.split('?')[1];
      expect(queryString).not.toMatch('fq');
    });
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
