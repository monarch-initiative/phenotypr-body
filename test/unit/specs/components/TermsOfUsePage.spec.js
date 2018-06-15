import Vuex from 'vuex';
import { shallow, createLocalVue } from '@vue/test-utils';

import TermsOfUsePage from '@/components/TermsOfUsePage';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('TermsOfUsePage.vue', () => {
  const acceptButtonSelector = 'input[type="button"]';
  const declineLinkSelector = 'a.decline';

  let store, state, mutations, mocks;

  beforeEach(() => {
    mocks = {
      $router: {
        push: jest.fn()
      }
    };

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
    expect(wrapper.find(acceptButtonSelector).exists()).toBe(true);
    expect(wrapper.find(declineLinkSelector).exists()).toBe(true);
  });

  test('clicking the accept button changes the route', () => {
    const wrapper = shallow(TermsOfUsePage, { store, localVue, mocks });
    wrapper.find(acceptButtonSelector).trigger('click');
    expect(mocks.$router.push).toHaveBeenCalledWith('/search');
  });

  test('clicking the accept button triggers acceptTermsOfUse', () => {
    const wrapper = shallow(TermsOfUsePage, { store, localVue, mocks });
    wrapper.find(acceptButtonSelector).trigger('click');
    expect(mutations.acceptTermsOfUse).toHaveBeenCalledWith(state, undefined);
  });
});
