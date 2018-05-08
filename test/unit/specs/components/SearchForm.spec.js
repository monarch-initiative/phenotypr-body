import { shallow } from '@vue/test-utils';
import SearchForm from '@/components/SearchForm';

// Stub out debounce to work around Jest timer issue:
// https://github.com/facebook/jest/issues/3465
jest.mock('lodash/debounce', () => jest.fn(fn => fn));

const exampleDocs = [
  {
    id: 'HP:0000316',
    label: 'Hypertelorism',
    exact_synonym: ['Widely spaced eyes', 'Wide-set eyes']
  }, {
    id: 'HP:0100539',
    label: 'Periorbital edema',
    exact_synonym: ['Swelling around the eyes', 'Puffiness around the eyes', 'Puffy eyes']
  }, {
    id: 'HP:0001090',
    label: 'Abnormally large globe',
    exact_synonym: ['Increased size of eyes', 'Large eyes']
  }, {
    id: 'HP:0001106',
    label: 'Periorbital hyperpigmentation',
    exact_synonym: ['Darkening around the eyes', 'Dark circles around the eyes', 'Dark circles under the eyes', 'Pigmentation around the eyes']
  }, {
    id: 'HP:0000601',
    label: 'Hypotelorism',
    exact_synonym: ['Abnormally close eyes', 'Closely spaced eyes']
  }
];

describe('SearchForm.vue', () => {
  const mockService = {
    search: jest.fn()
  };

  beforeEach(() => {
    mockService.search.mockReset();
  });

  test('should render a div with input and dropdown for suggestions', () => {
    const wrapper = shallow(SearchForm);
    expect(wrapper.is('div')).toBe(true);
    expect(wrapper.contains('label')).toBe(true);
    expect(wrapper.contains('input')).toBe(true);
    expect(wrapper.contains('.dropdown-pane')).toBe(true);
  });

  test('should render a list item for each search result', () => {
    const wrapper = shallow(SearchForm);

    // Suggestions are empty by default
    expect(wrapper.contains('li')).toBe(false);

    wrapper.setData({ suggestions: exampleDocs });

    expect(wrapper.findAll('li').length).toEqual(exampleDocs.length);
  });

  test('the down arrow key moves to the next suggestion', () => {
    const wrapper = shallow(SearchForm, {
      data: {
        suggestions: exampleDocs
      }
    });

    let expectedSelection = exampleDocs[0];
    let input = wrapper.find('input');

    // Nothing selected initially
    expect(wrapper.findAll('li.highlighted').length).toEqual(0);

    input.trigger('keydown.down');

    // First suggestion should be selected
    expect(wrapper.findAll('li.highlighted').length).toEqual(1);
    let selectedItem = wrapper.find('li.highlighted');
    expect(selectedItem.find('strong').text()).toEqual(expectedSelection.exact_synonym[0]);

    input.trigger('keydown.down');

    expectedSelection = exampleDocs[1];
    expect(wrapper.findAll('li.highlighted').length).toEqual(1);
    selectedItem = wrapper.find('li.highlighted');
    expect(selectedItem.find('strong').text()).toEqual(expectedSelection.exact_synonym[0]);
  });

  test('the up arrow key moves to the previous suggestion', () => {
    const wrapper = shallow(SearchForm, {
      data: {
        suggestions: exampleDocs,
        currentIndex: 1
      }
    });

    const input = wrapper.find('input');
    let expectedSelection = exampleDocs[1];

    // First suggestion should be selected
    expect(wrapper.findAll('li.highlighted').length).toEqual(1);
    let selectedItem = wrapper.find('li.highlighted');
    expect(selectedItem.find('strong').text()).toEqual(expectedSelection.exact_synonym[0]);

    input.trigger('keydown.up');

    expectedSelection = exampleDocs[0];
    expect(wrapper.findAll('li.highlighted').length).toEqual(1);
    selectedItem = wrapper.find('li.highlighted');
    expect(selectedItem.find('strong').text()).toEqual(expectedSelection.exact_synonym[0]);
  });

  test('mousing over a suggestion moves to that suggestion', () => {
    const wrapper = shallow(SearchForm, {
      data: {
        suggestions: exampleDocs
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
    const wrapper = shallow(SearchForm, {
      data: {
        suggestions: exampleDocs,
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
    const wrapper = shallow(SearchForm, {
      data: {
        suggestions: exampleDocs,
        currentIndex: 2
      }
    });

    const expectedSelection = exampleDocs[2];
    const input = wrapper.find('input');
    const state = wrapper.vm.$data;

    // Selected items should start empty
    expect(state.selections.length).toEqual(0);

    input.trigger('keydown.enter');

    // The selected item is captured
    expect(state.selections.length).toEqual(1);
    expect(state.selections[0]).toEqual(expectedSelection);

    // Other search state should be reset
    expect(state.suggestions).toEqual([]);
    expect(state.queryText).toEqual('');
  });

  test('clicking a suggestion selects it', () => {
    const wrapper = shallow(SearchForm, {
      data: {
        suggestions: exampleDocs
      }
    });

    const expectedSelection = exampleDocs[2];
    const suggestions = wrapper.findAll('li');
    const state = wrapper.vm.$data;

    // Selected items should start empty
    expect(state.selections.length).toEqual(0);

    // Click the third suggestion
    suggestions.wrappers[2].trigger('click');

    // The selected item is captured
    expect(state.selections.length).toEqual(1);
    expect(state.selections[0]).toEqual(expectedSelection);

    // Other search state should be reset
    expect(state.suggestions).toEqual([]);
    expect(state.queryText).toEqual('');
  });

  test('clears the suggestions when input is cleared', () => {
    const wrapper = shallow(SearchForm, {
      data: {
        queryText: 'wide eyes',
        suggestions: exampleDocs,
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

  test('calls the search service on input', (done) => {
    mockService.search.mockReturnValue(Promise.resolve({ docs: exampleDocs }));

    const wrapper = shallow(SearchForm, {
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
      expect(wrapper.vm.$data.suggestions).toEqual(exampleDocs);
      done();
    });
  });

  test('hasSuggestions computed property', () => {
    const wrapper = shallow(SearchForm);
    expect(wrapper.vm.hasSuggestions).toBe(false);

    wrapper.setData({ suggestions: exampleDocs });
    expect(wrapper.vm.hasSuggestions).toBe(true);
  });
});
