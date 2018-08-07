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
      selectedSystems: []
    };

    mutations = {
      toggleSystem: jest.fn()
    };
  });

  store = new Vuex.Store({state, mutations});

  describe('rendering', () => {
    test('renders all systems as checkboxes', () =>{
      const wrapper = shallow(BodySystemForm, {localVue, store});
      expect(wrapper.findAll('input[type=checkbox]').length).toBe(bodySystems.length);
    });

    test('submitbutton is disabled', () => {
      const wrapper = shallow(BodySystemForm, {localVue, store});
      const submitButton = wrapper.find('input[type=button]');
      expect(submitButton).toBeDefined();

      state.selectedSystems = [];

      expect(submitButton.attributes().disabled).toBeDefined();

    });
  });
});
