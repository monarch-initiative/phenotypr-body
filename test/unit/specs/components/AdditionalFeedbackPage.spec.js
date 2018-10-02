import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import AdditionalFeedbackPage from '@/components/AdditionalFeedbackPage';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('AdditionalFeedbackPage.vue', () => {
  let store, state, mutations, actions;

  beforeEach(() => {
    mutations = {
      setAdditionalSymptoms: jest.fn(),
      setAdditionalComments: jest.fn()
    };

    state = {
      additionalSymptoms: null,
      additionalComments: null
    };

    actions = {
      saveSessionData: jest.fn()
    };

    store = new Vuex.Store({ state, mutations, actions });
  });

  test('it renders a heading and a form', () => {
    const wrapper = shallowMount(AdditionalFeedbackPage, { store, localVue });
    expect(wrapper.contains('form')).toBe(true);
  });

  test('clicking the forward button updates state and saves the session', () => {
    const mocks = {
      $router: {
        push: jest.fn()
      }
    };

    const wrapper = shallowMount(AdditionalFeedbackPage, { store, localVue, mocks });

    wrapper.find('#additionalSymptoms').setValue('symptoms');
    wrapper.find('#additionalComments').setValue('comments');
    wrapper.find('form').trigger('submit');

    expect(mutations.setAdditionalSymptoms).toHaveBeenCalledWith(state, 'symptoms');
    expect(mutations.setAdditionalComments).toHaveBeenCalledWith(state, 'comments');
    expect(actions.saveSessionData).toHaveBeenCalled();
  });
});
