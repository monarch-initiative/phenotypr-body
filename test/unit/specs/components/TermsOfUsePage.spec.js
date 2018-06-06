import Vuex from 'vuex';
import router from '@/router/index.js'
import { shallow, createLocalVue } from '@vue/test-utils';

import TermsOfUsePage from '@/components/TermsOfUsePage';

const localVue = createLocalVue({
  router: router
});
localVue.use(Vuex);

describe('TermsOfUsePage.vue', () => {
  let store, state, mutations;

  beforeEach(() => {
    mutations = {
      acceptTermsOfUse: jest.fn()
    };

    state = {
      termsOfUseAccepted: false
    };

    store = new Vuex.Store({ state, mutations });
  });

  test('renders a form with terms of use accept and reject buttons', () => {
    const wrapper = shallow(TermsOfUsePage, { store, localVue });
    expect(wrapper.find('form').exists()).toBe(true);
  });

  // test('clicking Yes commits an acceptTermsOfUse mutation', () => {
  //   const wrapper = shallow(TermsOfUsePage, { store, localVue, router });
  //
  //   wrapper.vm.acceptTermsOfUse();
  //   expect(mutations.acceptTermsOfUse).toHaveBeenCalledWith(state);
  // });
});
