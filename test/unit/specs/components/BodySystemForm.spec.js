import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import BodySystemForm from '@/components/BodySystemForm';
import bodySystems from '@/store/systems';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('BodySystemForm.vue', () => {
  let store, state, mutations;

  beforeEach(() => {
    state = {
      selectedSystems: bodySystems.slice(1)
    };

    mutations = {
      toggleSystem: jest.fn()
    };

    store = new Vuex.Store({ state, mutations });
  });

  describe('rendering', () => {
    test('renders all systems as checkboxes', () => {
      const wrapper = shallowMount(BodySystemForm, { localVue, store });
      expect(wrapper.findAll('input[type=checkbox]').length).toBe(bodySystems.length);
    });

    test('submitButton is disabled', () => {
      const wrapper = shallowMount(BodySystemForm, { localVue, store });
      const submitButton = wrapper.find('input[type=button]');
      expect(submitButton.attributes().disabled).toBeUndefined();

      state.selectedSystems = [];
      expect(submitButton.attributes().disabled).toBeDefined();
    });

    test('if the system is in the store it is checked', () => {
      const selectedSystems = bodySystems.slice(0, 3);
      state.selectedSystems = selectedSystems;
      const wrapper = shallowMount(BodySystemForm, { localVue, store });
      selectedSystems.forEach(system => {
        const inputSelector = `input#${system.id.replace(':', '\\:')}`;
        const checkbox = wrapper.find(inputSelector);
        expect(checkbox.is(':checked')).toBeTruthy();
      });
    });
  });

  describe('actions', () => {
    test('if system is in store it is selected', () => {
      const wrapper = shallowMount(BodySystemForm, { store, localVue });
      const selectedSystem = state.selectedSystems[0];

      expect(wrapper.vm.isSystemSelected(selectedSystem.id)).toBe(true);
    });

    test('selecting a systems mutates the store', () => {
      const wrapper = shallowMount(BodySystemForm, { store, localVue });
      wrapper.find('input[type=checkbox]').trigger('click');
      expect(mutations.toggleSystem).toHaveBeenCalled();
    });

    test('clicking the help text link displays a description', () => {
      const selector = '.help-text';
      const wrapper = shallowMount(BodySystemForm, { store, localVue });
      const firstContainer = wrapper.findAll('.checkbox-container').at(0);

      // no help text is initially displayed
      expect(wrapper.findAll(selector)).toHaveLength(0);

      // clicking the link displays the help text for the category
      firstContainer.find('a').trigger('click');
      expect(firstContainer.findAll(selector)).toHaveLength(1);

      // no other help text is displayed
      expect(wrapper.findAll(selector)).toHaveLength(1);
    });

    test('clicking the button transitions to the search route', () => {
      const mocks = {
        $router: {
          push: jest.fn()
        }
      };
      const wrapper = shallowMount(BodySystemForm, { store, localVue, mocks });
      wrapper.find('input[type=button]').trigger('click');
      expect(mocks.$router.push).toHaveBeenCalledWith('/search');
    });
  });

  describe('computed properties', () => {
    test('state mapping', () => {
      const wrapper = shallowMount(BodySystemForm, { store, localVue });
      expect(wrapper.vm.selectedSystems).toEqual(state.selectedSystems);
    });

    test('selectionIsEmpty', () => {
      const wrapper = shallowMount(BodySystemForm, { store, localVue });
      expect(wrapper.vm.selectionIsEmpty).toBe(false);

      state.selectedSystems = [];
      expect(wrapper.vm.selectionIsEmpty).toBe(true);
    });
  });
});
