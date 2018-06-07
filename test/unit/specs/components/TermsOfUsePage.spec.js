import Vuex from 'vuex';
import storeConfig from '@/store';
import { shallow, createLocalVue } from '@vue/test-utils';

import TermsOfUsePage from '@/components/TermsOfUsePage';

const localVue = createLocalVue();
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
    const wrapper = shallow(TermsOfUsePage, { localVue, store });
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[value="Yes"]').exists()).toBe(true);
    expect(wrapper.find({ ref: 'terms-no-button' }).exists()).toBe(true);
  });

  test('clicking Yes commits an acceptTermsOfUse mutation', () => {
    const mocks = {
      $router: {
        push: jest.fn()
      }
    };
    const wrapper = shallow(TermsOfUsePage, { store, localVue, mocks });

    wrapper.vm.acceptTermsOfUse();
    expect(mutations.acceptTermsOfUse).toHaveBeenCalledWith(state, true);
    expect(mocks.$router.push).toHaveBeenCalledWith('/');
  });

  test('clicking Yes triggers acceptTermsOfUse', () => {
    const wrapper = shallow(TermsOfUsePage, { store, localVue });
    wrapper.find('input[value="Yes"]').trigger('click');
    expect(mutations.acceptTermsOfUse).toHaveBeenCalledWith(state, true);
  });
});
