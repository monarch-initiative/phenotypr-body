<template>
  <div class="autocomplete">
    <label class="lead">What symptoms are you experiencing?</label>
    <input type="search"
           v-model="queryText"
           @input="updateQueryText($event.target.value)"
           v-on:input="refreshSuggestions"
           @keydown.enter='enter'
           @keydown.down='down'
           @keydown.up='up'
           @keydown.esc='resetSearch'
           placeholder="Search for a symptom"
    >
    <span class="clear-search" :class="{ 'is-visible': hasSuggestions }" @click="resetSearch">X</span>
    <div ref="dropdown" class="search-results" :class="{ 'is-open': hasSuggestions }" data-dropdown>
      <ul ref="suggestionList">
        <li v-for="(suggestion, index) in suggestions"
            :key="suggestion.id"
            :class="{'highlighted': isActive(index)}"
            @click="suggestionClick(index)"
            @mouseover="mouseOver(index)"
            @mouseout="mouseOut()"
        >
          {{ suggestion.exact_synonym[0] }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  name: 'SearchInput',

  data() {
    return {
      queryText: '',
      suggestions: [],
      currentIndex: null
    };
  },

  methods: {
    /**
     * Resets the state to allow a new search.
     */
    resetSearch() {
      this.queryText = '';
      this.suggestions = [];
      this.currentIndex = null;
      this.$refs.dropdown.scrollTop = 0;
    },

    /**
     * Captures the item selected by the user.
     * @param {Number} index - the index in the `suggestions` array of the item selected.
     */
    selectItem(index) {
      if (typeof this.suggestions[index] !== 'undefined') {
        this.$emit('itemSelected', this.suggestions[index]);
      }
    },

    /**
     * Updates the query text on input.
     * @param {String} text - new query text.
     */
    updateQueryText(text) {
      this.queryText = text;
    },

    /**
     * Refreshes the list of suggested plain-language terms when input pauses.
     */
    refreshSuggestions: debounce(function() {
      if (this.queryText) {
        this.suggestions = [];
        this.$searchService.search(this.queryText)
          .then(response => {
            this.suggestions = response.docs;
          });
      } else {
        this.suggestions = [];
        this.currentIndex = null;
      }
    }, 500),

    /**
     * Selects the current item when the enter key is pressed.
     */
    enter() {
      this.selectItem(this.currentIndex);
      this.resetSearch();
    },

    /**
     * Moves the selection to the previous item when the up arrow is pressed.
     */
    up() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.scrollItemIntoView(this.currentIndex);
      }
    },

    /**
     * Moves the selection to the next item when the down arrow is pressed.
     */
    down() {
      if (this.currentIndex === null) {
        this.currentIndex = 0;
      } else if (this.currentIndex < this.suggestions.length - 1) {
        this.currentIndex++;
        this.scrollItemIntoView(this.currentIndex);
      }
    },

    /**
     * Selects an item when clicked with the mouse.
     * @param {Number} index - the index in the `suggestions` array of the clicked item.
     */
    suggestionClick(index) {
      this.selectItem(index);
      this.resetSearch();
    },

    /**
     * Moves the current selection to the item under the mouse.
     * @param {Number} index - the index in the `suggestions` array of the item under the mouse.
     */
    mouseOver(index) {
      this.currentIndex = index;
    },

    /**
     * Clears the current selection when the mouse leaves an item.
     */
    mouseOut() {
      this.currentIndex = null;
    },

    /**
     * Reports whether the item at `index` is the current selection.
     * @param {Number} index - an index into the `suggestions` array.
     * @return true if `index` is equal to `currentIndex`, false otherwise.
     */
    isActive(index) {
      return index === this.currentIndex;
    },

    /**
     * Scrolls a suggestion item into the visible portion of the dropdown. If the item is
     * below the visible portion of the dropdown, scroll up until its bottom edge touches
     * the bottom of the dropdown. If above the visible portion of the dropdown, scroll
     * down until its top edge touches the top of the dropdown.
     * @param {Number} index - an index into the `suggestions` array.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
     */
    scrollItemIntoView(index) {
      const dropdown = this.$refs.dropdown;
      const listItems = this.$refs.suggestionList.children;
      const currentItem = listItems[index];

      const maxVisible = dropdown.scrollTop + dropdown.clientHeight;
      const aboveVisible = currentItem.offsetTop < dropdown.scrollTop;
      const belowVisible = currentItem.offsetTop + currentItem.clientHeight > maxVisible;

      if (aboveVisible || belowVisible) {
        currentItem.scrollIntoView && currentItem.scrollIntoView(aboveVisible);
      }
    }
  },

  computed: {
    /**
     * A computed property that indicates if suggestions are available.
     */
    hasSuggestions() {
      return this.suggestions.length > 0;
    }
  }
};
</script>

<style lang="css">
.autocomplete {
  position: relative;
}

.autocomplete input {
  margin-bottom: 0;
}

/* https://stackoverflow.com/questions/14007655/remove-ie10s-clear-field-x-button-on-certain-inputs */
.autocomplete input::-ms-clear {
  width: 0;
  height: 0;
}

.autocomplete .clear-search {
  position: absolute;
  left: 95%;
  bottom: 8px;
  color: #7e7e7e;
  visibility: hidden;
}

.autocomplete .clear-search:hover {
  cursor: pointer;
}

.autocomplete .clear-search.is-visible {
  visibility: visible;
}

.autocomplete .search-results {
  background: #fff;
  border: 1px solid #cacaca;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 99;
  visibility: hidden;
}

.autocomplete .search-results.is-open {
  visibility: visible;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}

.autocomplete .search-results ul {
  margin: 0;
}

.autocomplete .search-results ul li {
  padding: 10px;
  list-style-type: none;
}

.autocomplete .search-results li:before {
  content: none;
}

.highlighted {
  background-color: #f8f8f8;
}
</style>
