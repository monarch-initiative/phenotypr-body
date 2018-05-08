<template>
  <div class="autocomplete">
    <label class="question form-label">What symptoms are you experiencing?</label>
    <input type="search"
           v-model="queryText"
           @input="updateQueryText($event.target.value)"
           v-on:input="refreshSuggestions"
           @keydown.enter='enter'
           @keydown.down='down'
           @keydown.up='up'
           placeholder="Search for a symptom"
    >
    <div class="dropdown-pane" :class="{'is-open': hasSuggestions }" data-dropdown>
      <ul>
        <li v-for="(suggestion, index) in suggestions"
            :key="suggestion.id"
            :class="{'highlighted': isActive(index)}"
            @click="suggestionClick(index)"
            @mouseover="mouseOver(index)"
            @mouseout="mouseOut()"
        >
          <strong>{{ suggestion.exact_synonym[0] }}</strong><br/>
          <small>{{ suggestion.label }}</small>
          <small>{{ suggestion.id }}</small>
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
    },

    /**
     * Captures the item selected by the user.
     * @param {Number} index - the index in the `suggestions` array of the item selected.
     */
    selectItem(index) {
      this.$emit('itemSelected', this.suggestions[index]);
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
  margin-top: 50px;
}

.autocomplete input {
  margin-bottom: 0;
}

.autocomplete .dropdown-pane {
  position: inherit;
  width: 100%;
}

.autocomplete .dropdown-pane ul li {
  list-style-type: none;
}

.highlighted {
  background-color: #f8f8f8;
}
</style>
