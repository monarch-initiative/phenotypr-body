import Vuex from 'vuex';
import { shallow, createLocalVue } from '@vue/test-utils';

import SearchPage from '@/components/SearchPage';
import SearchInput from '@/components/SearchInput';
import exampleResponses from '../../example-responses';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('SearchPage.vue', () => {
  let store, state, mutations;

  beforeEach(() => {
    mutations = {
      addTerm: jest.fn(),
      removeTermAtIndex: jest.fn()
    };

    state = {
      selectedTerms: exampleResponses.slice(2)
    };

    store = new Vuex.Store({ state, mutations });
  });

  test('renders a form with a search input', () => {
    const wrapper = shallow(SearchPage, { store, localVue });
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find(SearchInput).exists()).toBe(true);
  });

  test('renders a tag for each selected term', () => {
    const tagCount = store.state.selectedTerms.length;
    const wrapper = shallow(SearchPage, { store, localVue });
    expect(wrapper.findAll('.symptom-tag').length).toEqual(tagCount);
  });

  test('selecting an item commits an addTerm mutation', () => {
    const wrapper = shallow(SearchPage, { store, localVue });
    const expectedItem = exampleResponses[2];

    wrapper.vm.handleSelection(expectedItem);
    expect(mutations.addTerm).toHaveBeenCalledWith(state, expectedItem);
  });

  test('clicking the X on a tag commits a removeTermAtIndex mutation', () => {
    const wrapper = shallow(SearchPage, { store, localVue });
    const tagRemovalButtons = wrapper.findAll('.symptom-tag strong');

    tagRemovalButtons.at(1).trigger('click');
    expect(mutations.removeTermAtIndex).toHaveBeenCalledWith(state, 1);
  });

  test('the button is disabled when no terms are selected', () => {
    const wrapper = shallow(SearchPage, { store, localVue });
    const submitButton = wrapper.find('input[type=button]');
    expect(submitButton.attributes().disabled).toBeUndefined();

    state.selectedTerms = [];
    expect(submitButton.attributes().disabled).toBeDefined();
  });

  test('clicking the button transitions to the results route', () => {
    const mocks = {
      $router: {
        push: jest.fn()
      }
    };

    const wrapper = shallow(SearchPage, { store, localVue, mocks });

    wrapper.find('input[type=button]').trigger('click');
    expect(mocks.$router.push).toHaveBeenCalledWith('/results');
  });
});
