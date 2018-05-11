import Vuex from 'vuex';
import { shallow, createLocalVue } from '@vue/test-utils';

import ResultsPage from '@/components/ResultsPage';
import exampleResponses from '../../example-responses';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('ResultsPage.vue', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        selectedTerms: exampleResponses
      }
    });
  });

  test('renders the selected terms', () => {
    const wrapper = shallow(ResultsPage, { store, localVue });
    expect(wrapper.classes()).toContain('results-page');
    expect(wrapper.findAll('tbody tr').length).toEqual(exampleResponses.length);
  });
});
