import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

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
      calculateQualityScore: jest.fn()
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
      const wrapper = shallowMount(SearchPage, { store, localVue });
      expect(wrapper.find('form').exists()).toBe(true);
      expect(wrapper.find(SearchInput).exists()).toBe(true);
    });

    test('renders diagnostic quality feedback (annotation sufficiency)', () => {
      const wrapper = shallowMount(SearchPage, { store, localVue });
      expect(wrapper.find(AnnotationSufficiency).exists()).toBe(true);
    });

    test('renders a tag for each selected term', () => {
      const tagCount = store.state.selectedTerms.length;
      const wrapper = shallowMount(SearchPage, { store, localVue });
      expect(wrapper.findAll('.symptom-tag').length).toEqual(tagCount);
    });

    test('the submit button is disabled when no terms are selected', () => {
      const wrapper = shallowMount(SearchPage, { store, localVue });
      const forwardButton = wrapper.find('input[name=forwardButton]');
      expect(forwardButton.attributes().disabled).toBeUndefined();

      state.selectedTerms = [];
      expect(forwardButton.attributes().disabled).toBeDefined();
    });
  });

  describe('actions', () => {
    test('selecting an item adds the term to the store', () => {
      const wrapper = shallowMount(SearchPage, { store, localVue });
      const expectedItem = exampleTerms[2];

      wrapper.vm.handleSelection(expectedItem);
      expect(mutations.addTerm).toHaveBeenCalledWith(state, expectedItem);
    });

    test('selecting an item recalculates the quality score', () => {
      const wrapper = shallowMount(SearchPage, { store, localVue });
      const expectedItem = exampleTerms[2];

      wrapper.vm.handleSelection(expectedItem);
      expect(actions.calculateQualityScore).toHaveBeenCalled();
    });

    test('clicking the X on a tag removes it from the store', () => {
      const wrapper = shallowMount(SearchPage, { store, localVue });
      const tagRemovalButtons = wrapper.findAll('.symptom-tag strong');

      tagRemovalButtons.at(1).trigger('click');
      expect(mutations.removeTermAtIndex).toHaveBeenCalledWith(state, 1);
    });

    test('clicking the X on a tag recalculates the quality score', () => {
      const wrapper = shallowMount(SearchPage, { store, localVue });
      const tagRemovalButtons = wrapper.findAll('.symptom-tag strong');

      tagRemovalButtons.at(1).trigger('click');
      expect(actions.calculateQualityScore).toHaveBeenCalled();
    });

    test('clicking the submit button transitions to the feedback route', () => {
      const mocks = {
        $router: {
          push: jest.fn()
        }
      };

      const wrapper = shallowMount(SearchPage, { store, localVue, mocks });
      const forwardButton = wrapper.find('input[name=forwardButton]');

      forwardButton.trigger('click');
      expect(mocks.$router.push).toHaveBeenCalledWith('/feedback');
    });

    test('clicking the submit button transitions to the feedback route with props', () => {
      const mocks = {
        $router: {
          push: jest.fn()
        }
      };

      const wrapper = shallowMount(SearchPage, { store, localVue, mocks });
      const forwardButton = wrapper.find('input[name=forwardButton]');
      const mockRoute = {path: '/feedback', query: {finishSearch: true}};

      wrapper.setProps({enableFilter: true});
      forwardButton.trigger('click');
      expect(mocks.$router.push).toHaveBeenCalledWith(mockRoute);
    });
  });

  describe('computed properties', () => {
    test('state mapping', () => {
      const wrapper = shallowMount(SearchPage, { store, localVue });
      expect(wrapper.vm.selections).toEqual(state.selectedTerms);
      expect(wrapper.vm.qualityScore).toEqual(state.qualityScore);
      expect(wrapper.vm.scoringError).toEqual(state.scoringError);
      expect(wrapper.vm.selectedSystems).toEqual(state.selectedSystems);
    });

    test('selectionIsEmpty', () => {
      const wrapper = shallowMount(SearchPage, { store, localVue });
      expect(wrapper.vm.selectionIsEmpty).toBe(false);

      state.selectedTerms = [];
      expect(wrapper.vm.selectionIsEmpty).toBe(true);
    });

    test('selectedSystemIds', () => {
      const selectedSystem = state.selectedSystems[0];
      const wrapper = shallowMount(SearchPage, { store, localVue });
      expect(wrapper.vm.selectedSystemIds).toEqual([selectedSystem.id]);

      state.selectedSystems = [];
      expect(wrapper.vm.selectedSystemIds).toEqual([]);
    });

    test('categoriesEnabled', () => {
      const wrapper = shallowMount(SearchPage, { store, localVue });
      expect(wrapper.vm.categoriesEnabled).toBe(false);
      wrapper.setProps({enableFilter: true});
      expect(wrapper.vm.categoriesEnabled).toBe(true);
    });
  });
});
