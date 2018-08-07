import Vuex from 'vuex';
import {createLocalVue, shallow} from '@vue/test-utils';

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

    store = new Vuex.Store({state, mutations});
  });

  describe('rendering', () => {
    test('renders all systems as checkboxes', () =>{
      const wrapper = shallow(BodySystemForm, {localVue, store});
      expect(wrapper.findAll('input[type=checkbox]').length).toBe(bodySystems.length);
    });

    test('submitButton is disabled', () => {
      const wrapper = shallow(BodySystemForm, {localVue, store});
      const submitButton = wrapper.find('input[type=button]');
      expect(submitButton.attributes().disabled).toBeUndefined();

      state.selectedSystems = [];
      expect(submitButton.attributes().disabled).toBeDefined();
    });

    // TODO if the system is in the store it is checked

  });

  describe('actions', () => {
    test('if system is in store it is selected', () => {
      const wrapper = shallow(BodySystemForm, {store, localVue});
      const selectedSystem = state.selectedSystems[0];

      expect(wrapper.vm.isSystemSelected(selectedSystem.id)).toBe(true);
    });

    test('selecting a systems mutates the store', () => {
      const wrapper = shallow(BodySystemForm, {store, localVue});
      const cb = wrapper.find('input[type=checkbox]').trigger('click');
      expect(mutations.toggleSystem).toHaveBeenCalled();
    });

    test('clicking the button transitions to the search route', () => {
      const mocks = {
        $router: {
          push: jest.fn()
        }
      };
      const wrapper = shallow(BodySystemForm, {store, localVue, mocks});
      wrapper.find('input[type=button]').trigger('click');
      expect(mocks.$router.push).toHaveBeenCalledWith('/search');
    });
  });

  describe('computed properties', () => {
    test('state mapping', () => {
      const wrapper = shallow(BodySystemForm, { store, localVue });
      expect(wrapper.vm.selectedSystems).toEqual(state.selectedSystems);
    });

    test('selectionIsEmpty', () => {
      const wrapper = shallow(BodySystemForm, { store, localVue });
      expect(wrapper.vm.selectionIsEmpty).toBe(false);

      // TODO Perform the inverse test.
    });
  });

});
