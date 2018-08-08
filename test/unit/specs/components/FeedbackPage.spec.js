import Vuex from 'vuex';
import { shallow, createLocalVue } from '@vue/test-utils';

import FeedbackPage from '@/components/FeedbackPage';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('FeedbackPage.vue', () => {
  let store, state, mutations;

  beforeEach(() => {
    mutations = {
      setFoundAllConditions: jest.fn()
    };

    state = {
      foundAllConditions: null
    };

    store = new Vuex.Store({ state, mutations });
  });

  test('renders a pair of radio buttons', () => {
    const wrapper = shallow(FeedbackPage, { store, localVue });
    expect(wrapper.findAll('input[type=radio]').length).toEqual(2);
  });

  test('checked radio button matches state', () => {
    const checkedRadioSelector = 'input[type=radio]:checked';
    const wrapper = shallow(FeedbackPage, { store, localVue });

    // nothing selected initially
    let checkedRadios = wrapper.findAll(checkedRadioSelector);
    expect(checkedRadios.length).toEqual(0);

    state.foundAllConditions = false;
    checkedRadios = wrapper.findAll(checkedRadioSelector);
    expect(checkedRadios.length).toEqual(1);
    expect(wrapper.find('input[value="0"]').is(':checked')).toBeTruthy();

    state.foundAllConditions = true;
    checkedRadios = wrapper.findAll(checkedRadioSelector);
    expect(checkedRadios.length).toEqual(1);
    expect(wrapper.find('input[value="1"]').is(':checked')).toBeTruthy();
  });

  test('clicking radio buttons mutates the state', () => {
    const wrapper = shallow(FeedbackPage, { store, localVue });
    const checkBoxes = wrapper.findAll('input[type=radio]');

    checkBoxes.at(0).trigger('click');
    expect(mutations.setFoundAllConditions).toHaveBeenCalledWith(state, true);

    mutations.setFoundAllConditions.mockReset();
    checkBoxes.at(1).trigger('click');
    expect(mutations.setFoundAllConditions).toHaveBeenCalledWith(state, false);
  });

  test('submit button is disabled until feedback is complete', () => {
    const wrapper = shallow(FeedbackPage, { store, localVue });
    const submitButton = wrapper.find('input[name=submitButton]');

    // should be disabled if nothing has been chosen
    expect(submitButton.attributes().disabled).toBeTruthy();

    // should be enabled if feedback has been provided
    state.foundAllConditions = true;
    expect(submitButton.attributes().disabled).toBeFalsy();

    state.foundAllConditions = false;
    expect(submitButton.attributes().disabled).toBeFalsy();
  });

  test('clicking the back button transitions to the search route', () => {
    const mocks = {
      $router: {
        push: jest.fn()
      }
    };

    const wrapper = shallow(FeedbackPage, { store, localVue, mocks });

    wrapper.find('input[name=backButton]').trigger('click');
    expect(mocks.$router.push).toHaveBeenCalledWith('/search');
  });

  test('clicking the submit button transitions to the results route', () => {
    const mocks = {
      $router: {
        push: jest.fn()
      }
    };

    state.foundAllConditions = true;
    const wrapper = shallow(FeedbackPage, { store, localVue, mocks });

    wrapper.find('input[name=submitButton]').trigger('click');
    expect(mocks.$router.push).toHaveBeenCalledWith('/results');
  });

  describe('computed properties', () => {
    test('state mapping', () => {
      const wrapper = shallow(FeedbackPage, { store, localVue });
      expect(wrapper.vm.foundAllConditions).toBeNull();

      state.foundAllConditions = true;
      expect(wrapper.vm.foundAllConditions).toBe(true);
    });

    test('feedbackIncomplete', () => {
      const wrapper = shallow(FeedbackPage, { store, localVue });

      // is true if foundAllConditions is null
      expect(wrapper.vm.feedbackIncomplete).toBe(true);

      // is false if foundAllConditions is not null
      state.foundAllConditions = true;
      expect(wrapper.vm.feedbackIncomplete).toBe(false);
      state.foundAllConditions = false;
      expect(wrapper.vm.feedbackIncomplete).toBe(false);
    });

    test('trueChecked', () => {
      const wrapper = shallow(FeedbackPage, { store, localVue });

      // false when foundAllConditions is null or false
      expect(wrapper.vm.trueChecked).toBe(false);
      state.foundAllConditions = false;
      expect(wrapper.vm.trueChecked).toBe(false);

      // true when foundAllConditions is true
      state.foundAllConditions = true;
      expect(wrapper.vm.trueChecked).toBe(true);
    });

    test('falseChecked', () => {
      const wrapper = shallow(FeedbackPage, { store, localVue });

      // false when foundAllConditions is null or true
      expect(wrapper.vm.falseChecked).toBe(false);
      state.foundAllConditions = true;
      expect(wrapper.vm.falseChecked).toBe(false);

      // true when foundAllConditions is false
      state.foundAllConditions = false;
      expect(wrapper.vm.falseChecked).toBe(true);
    });
  });
});
