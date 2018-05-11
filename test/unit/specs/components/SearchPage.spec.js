import { shallow } from '@vue/test-utils';
import SearchPage from '@/components/SearchPage';
import SearchInput from '@/components/SearchInput';

import exampleResponses from '../../example-responses';

describe('SearchPage.vue', () => {
  test('renders a form with a search input', () => {
    const wrapper = shallow(SearchPage);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find(SearchInput).exists()).toBe(true);
  });

  test('renders a tag for each selected term', () => {
    const wrapper = shallow(SearchPage);
    const sliceIndex = 2;

    expect(wrapper.findAll('.symptom-tag').length).toEqual(0);

    wrapper.setData({
      // Take items from index 2 to the end
      selections: exampleResponses.slice(sliceIndex)
    });

    expect(wrapper.findAll('.symptom-tag').length).toEqual(exampleResponses.length - sliceIndex);
  });

  test('selecting an item adds a tag', () => {
    const wrapper = shallow(SearchPage);
    const expectedItem = exampleResponses[2];

    expect(wrapper.findAll('.symptom-tag').length).toEqual(0);

    wrapper.vm.handleSelection(expectedItem);

    const tags = wrapper.findAll('.symptom-tag');
    expect(tags.length).toEqual(1);
    expect(tags.at(0).text()).toContain(expectedItem.exact_synonym[0]);
  });

  test('clicking the X on a tag removes it', () => {
    const expectedItem = exampleResponses[3];
    const wrapper = shallow(SearchPage, {
      data: {
        selections: [expectedItem]
      }
    });

    let tags = wrapper.findAll('.symptom-tag');
    expect(tags.length).toEqual(1);

    tags.at(0).find('strong').trigger('click');

    tags = wrapper.findAll('.symptom-tag');
    expect(tags.length).toEqual(0);
  });
});
