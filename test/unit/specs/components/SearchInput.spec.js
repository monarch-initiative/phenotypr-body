import { shallow } from '@vue/test-utils';
import SearchInput from '@/components/SearchInput';

import exampleResponses from '../../example-responses';

// Stub out debounce to work around Jest timer issue:
// https://github.com/facebook/jest/issues/3465
jest.mock('lodash/debounce', () => jest.fn(fn => fn));

describe('SearchInput.vue', () => {
  const mockService = {
    search: jest.fn()
  };

  beforeEach(() => {
    mockService.search.mockReset();
  });

  test('should render a div with input and dropdown for suggestions', () => {
    const wrapper = shallow(SearchInput);
    expect(wrapper.is('div')).toBe(true);
    expect(wrapper.contains('label')).toBe(true);
    expect(wrapper.contains('input')).toBe(true);
    expect(wrapper.contains('.dropdown-pane')).toBe(true);
  });

  test('should render a list item for each search result', () => {
    const wrapper = shallow(SearchInput);

    // Suggestions are empty by default
    expect(wrapper.contains('li')).toBe(false);

    wrapper.setData({ suggestions: exampleResponses });

    expect(wrapper.findAll('li').length).toEqual(exampleResponses.length);
  });

  test('the down arrow key moves to the next suggestion', () => {
    const wrapper = shallow(SearchInput, {
      data: {
        suggestions: exampleResponses
      }
    });

    let expectedSelection = exampleResponses[0];
    let input = wrapper.find('input');

    // Nothing selected initially
    expect(wrapper.findAll('li.highlighted').length).toEqual(0);

    input.trigger('keydown.down');

    // First suggestion should be selected
    expect(wrapper.findAll('li.highlighted').length).toEqual(1);
    let selectedItem = wrapper.find('li.highlighted');
    expect(selectedItem.text()).toEqual(expectedSelection.exact_synonym[0]);

    input.trigger('keydown.down');

    expectedSelection = exampleResponses[1];
    expect(wrapper.findAll('li.highlighted').length).toEqual(1);
    selectedItem = wrapper.find('li.highlighted');
    expect(selectedItem.text()).toEqual(expectedSelection.exact_synonym[0]);
  });

  test('the up arrow key moves to the previous suggestion', () => {
    const wrapper = shallow(SearchInput, {
      data: {
        suggestions: exampleResponses,
        currentIndex: 1
      }
    });

    const input = wrapper.find('input');
    let expectedSelection = exampleResponses[1];

    // Second suggestion should be selected
    expect(wrapper.findAll('li.highlighted').length).toEqual(1);
    let selectedItem = wrapper.find('li.highlighted');
    expect(selectedItem.text()).toEqual(expectedSelection.exact_synonym[0]);

    input.trigger('keydown.up');

    // First suggestion should now be selected
    expectedSelection = exampleResponses[0];
    expect(wrapper.findAll('li.highlighted').length).toEqual(1);
    selectedItem = wrapper.find('li.highlighted');
    expect(selectedItem.text()).toEqual(expectedSelection.exact_synonym[0]);
  });

  test('mousing over a suggestion moves to that suggestion', () => {
    const wrapper = shallow(SearchInput, {
      data: {
        suggestions: exampleResponses
      }
    });

    const suggestions = wrapper.findAll('li');

    // Nothing should be highlighted
    expect(wrapper.findAll('li.highlighted').length).toEqual(0);

    const selectedItem = suggestions.wrappers[3];
    selectedItem.trigger('mouseover');

    // Item should now be the current item
    expect(selectedItem.classes()).toContain('highlighted');
    expect(wrapper.vm.currentIndex).toEqual(3);
  });

  test('mousing out of a suggestion clears the selection', () => {
    const wrapper = shallow(SearchInput, {
      data: {
        suggestions: exampleResponses,
        currentIndex: 2
      }
    });

    const suggestions = wrapper.findAll('li');
    const selectedItem = suggestions.wrappers[2];

    // Item should be highlighted
    expect(selectedItem.classes()).toContain('highlighted');

    selectedItem.trigger('mouseout');

    // Nothing should be selected
    expect(wrapper.findAll('li.highlighted').length).toEqual(0);
    expect(wrapper.vm.currentIndex).toBeNull();
  });

  test('the enter key selects the current suggestion', () => {
    const wrapper = shallow(SearchInput, {
      data: {
        suggestions: exampleResponses,
        currentIndex: 2
      }
    });

    const expectedSelection = exampleResponses[2];
    const input = wrapper.find('input');
    const state = wrapper.vm.$data;

    input.trigger('keydown.enter');

    // An event is emitted with the selected item
    expect(wrapper.emitted().itemSelected).toBeTruthy();
    expect(wrapper.emitted().itemSelected[0]).toContain(expectedSelection);

    // Search state should be reset
    expect(state.suggestions).toEqual([]);
    expect(state.queryText).toEqual('');
  });

  test('hitting enter without a selection does not emit an item', () => {
    const wrapper = shallow(SearchInput);

    const input = wrapper.find('input');
    input.trigger('keydown.enter');

    expect(wrapper.emitted().itemSelected).toBe(undefined);
  });

  test('clicking a suggestion selects it', () => {
    const wrapper = shallow(SearchInput, {
      data: {
        suggestions: exampleResponses
      }
    });

    const expectedSelection = exampleResponses[2];
    const suggestions = wrapper.findAll('li');
    const state = wrapper.vm.$data;

    // Click the third suggestion
    suggestions.wrappers[2].trigger('click');

    // An event is emitted with the selected item
    expect(wrapper.emitted().itemSelected).toBeTruthy();
    expect(wrapper.emitted().itemSelected[0]).toContain(expectedSelection);

    // Search state should be reset
    expect(state.suggestions).toEqual([]);
    expect(state.queryText).toEqual('');
  });

  test('clears the suggestions when input is cleared', () => {
    const wrapper = shallow(SearchInput, {
      data: {
        queryText: 'wide eyes',
        suggestions: exampleResponses,
        currentIndex: 1
      }
    });

    const input = wrapper.find('input');
    input.element.value = '';
    input.trigger('input');

    const state = wrapper.vm.$data;
    expect(state.queryText).toEqual('');
    expect(state.suggestions).toEqual([]);
    expect(state.currentIndex).toEqual(null);
  });

  test('clears the search when the icon is clicked', () => {
    const wrapper = shallow(SearchInput, {
      data: {
        queryText: 'wide eyes',
        suggestions: exampleResponses,
        currentIndex: 1
      }
    });

    const clearIcon = wrapper.find('span.clear-search');
    clearIcon.trigger('click');

    const state = wrapper.vm.$data;
    expect(state.queryText).toEqual('');
    expect(state.suggestions).toEqual([]);
    expect(state.currentIndex).toEqual(null);
  });

  test('clears the search on escape key', () => {
    const wrapper = shallow(SearchInput, {
      data: {
        queryText: 'wide eyes',
        suggestions: exampleResponses,
        currentIndex: 1
      }
    });

    const input = wrapper.find('input');
    input.trigger('keydown.esc');

    const state = wrapper.vm.$data;
    expect(state.queryText).toEqual('');
    expect(state.suggestions).toEqual([]);
    expect(state.currentIndex).toEqual(null);
  });

  test('calls the search service on input', (done) => {
    mockService.search.mockReturnValue(Promise.resolve({ docs: exampleResponses }));

    const wrapper = shallow(SearchInput, {
      mocks: {
        $searchService: mockService
      }
    });

    // Suggestions should start out empty
    expect(wrapper.vm.$data.suggestions).toEqual([]);

    const input = wrapper.find('input');
    input.element.value = 'wide-set eyes';
    input.trigger('input');

    wrapper.vm.$nextTick(() => {
      expect(mockService.search).toHaveBeenCalledWith('wide-set eyes');
      expect(wrapper.vm.$data.suggestions).toEqual(exampleResponses);
      done();
    });
  });

  test('hasSuggestions computed property', () => {
    const wrapper = shallow(SearchInput);
    expect(wrapper.vm.hasSuggestions).toBe(false);

    wrapper.setData({ suggestions: exampleResponses });
    expect(wrapper.vm.hasSuggestions).toBe(true);
  });
});
