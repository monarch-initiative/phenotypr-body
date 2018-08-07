import Vuex from 'vuex';
import { shallow, createLocalVue } from '@vue/test-utils';

import SearchPage from '@/components/SearchPage';
import SearchInput from '@/components/SearchInput';
import AnnotationSufficiency from '@/components/AnnotationSufficiency';

import bodySystems from '@/store/systems';
import exampleTerms from '../../example-terms';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('SearchPage.vue', () => {
  let store, state, mutations, actions;

  beforeEach(() => {
    mutations = {
      addTerm: jest.fn(),
      removeTermAtIndex: jest.fn()
    };

    actions = {
      calculateQualityScore: jest.fn(),
      saveSelectedTerms: jest.fn()
    };

    state = {
      selectedSystems: bodySystems.slice(0, 1),
      selectedTerms: exampleTerms.slice(2),
      qualityScore: 0.25,
      scoringError: new Error('example')
    };

    store = new Vuex.Store({ state, mutations, actions });
  });

  describe('rendering', () => {
    test('renders a form with a search input', () => {
      const wrapper = shallow(SearchPage, { store, localVue });
      expect(wrapper.find('form').exists()).toBe(true);
      expect(wrapper.find(SearchInput).exists()).toBe(true);
    });

    test('renders diagnostic quality feedback (annotation sufficiency)', () => {
      const wrapper = shallow(SearchPage, { store, localVue });
      expect(wrapper.find(AnnotationSufficiency).exists()).toBe(true);
    });

    test('renders a tag for each selected term', () => {
      const tagCount = store.state.selectedTerms.length;
      const wrapper = shallow(SearchPage, { store, localVue });
      expect(wrapper.findAll('.symptom-tag').length).toEqual(tagCount);
    });

    test('the button is disabled when no terms are selected', () => {
      const wrapper = shallow(SearchPage, { store, localVue });
      const submitButton = wrapper.find('input[type=button]');
      expect(submitButton.attributes().disabled).toBeUndefined();

      state.selectedTerms = [];
      expect(submitButton.attributes().disabled).toBeDefined();
    });
  });

  describe('actions', () => {
    test('selecting an item adds the term to the store', () => {
      const wrapper = shallow(SearchPage, { store, localVue });
      const expectedItem = exampleTerms[2];

      wrapper.vm.handleSelection(expectedItem);
      expect(mutations.addTerm).toHaveBeenCalledWith(state, expectedItem);
    });

    test('selecting an item recalculates the quality score', () => {
      const wrapper = shallow(SearchPage, { store, localVue });
      const expectedItem = exampleTerms[2];

      wrapper.vm.handleSelection(expectedItem);
      expect(actions.calculateQualityScore).toHaveBeenCalled();
    });

    test('clicking the X on a tag removes it from the store', () => {
      const wrapper = shallow(SearchPage, { store, localVue });
      const tagRemovalButtons = wrapper.findAll('.symptom-tag strong');

      tagRemovalButtons.at(1).trigger('click');
      expect(mutations.removeTermAtIndex).toHaveBeenCalledWith(state, 1);
    });

    test('clicking the X on a tag recalculates the quality score', () => {
      const wrapper = shallow(SearchPage, { store, localVue });
      const tagRemovalButtons = wrapper.findAll('.symptom-tag strong');

      tagRemovalButtons.at(1).trigger('click');
      expect(actions.calculateQualityScore).toHaveBeenCalled();
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

    test('clicking the button saves the selected terms', () => {
      const mocks = {
        $router: {
          push: jest.fn()
        }
      };

      const wrapper = shallow(SearchPage, { store, localVue, mocks });

      wrapper.find('input[type=button]').trigger('click');
      expect(actions.saveSelectedTerms).toHaveBeenCalled();
    });
  });

  describe('computed properties', () => {
    test('state mapping', () => {
      const wrapper = shallow(SearchPage, { store, localVue });
      expect(wrapper.vm.selections).toEqual(state.selectedTerms);
      expect(wrapper.vm.qualityScore).toEqual(state.qualityScore);
      expect(wrapper.vm.scoringError).toEqual(state.scoringError);
      expect(wrapper.vm.selectedSystems).toEqual(state.selectedSystems);
    });

    test('selectionIsEmpty', () => {
      const wrapper = shallow(SearchPage, { store, localVue });
      expect(wrapper.vm.selectionIsEmpty).toBe(false);

      state.selectedTerms = [];
      expect(wrapper.vm.selectionIsEmpty).toBe(true);
    });

    test('selectedSystemIds', () => {
      const selectedSystem = state.selectedSystems[0];
      const wrapper = shallow(SearchPage, { store, localVue });
      expect(wrapper.vm.selectedSystemIds).toEqual([selectedSystem.id]);

      state.selectedSystems = [];
      expect(wrapper.vm.selectedSystemIds).toEqual([]);
    });
  });
});
