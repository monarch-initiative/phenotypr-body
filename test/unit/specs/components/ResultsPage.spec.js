import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import ResultsPage from '@/components/ResultsPage';
import PdfRenderer from '@/utils/pdf-renderer';
import isExportDocument from '@/utils/is-export-document';
import exampleTerms from '../../example-terms';

const localVue = createLocalVue();
localVue.use(Vuex);

// NOTE: Returns an empty mock implementation to work around Jest's apparent inability
// to automatically mock modules in the `src/` directory. Enables mocking the constructor
// below.
jest.mock('@/utils/pdf-renderer', () => {
  return jest.fn().mockImplementation(() => ({}));
});

describe('ResultsPage.vue', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        selectedTerms: exampleTerms
      }
    });
  });

  test('renders the selected terms', () => {
    const wrapper = shallowMount(ResultsPage, { store, localVue });
    expect(wrapper.findAll('tbody tr').length).toEqual(exampleTerms.length);
  });

  test('generates and downloads PDF when the button is clicked', () => {
    const mockRender = jest.fn();
    const mockPdf = { download: jest.fn() };

    mockRender.mockReturnValue(mockPdf);
    PdfRenderer.mockImplementation(() => {
      return {
        renderDocument: mockRender
      };
    });

    const wrapper = shallowMount(ResultsPage, { store, localVue });
    wrapper.find('input.button').trigger('click');

    expect(PdfRenderer).toHaveBeenCalled();
    expect(mockRender).toHaveBeenCalled();
    expect(isExportDocument(mockRender.mock.calls[0][0])).toBe(true);
    expect(mockPdf.download).toHaveBeenCalled();
  });
});
