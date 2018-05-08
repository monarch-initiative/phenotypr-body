<template>
  <div class="questions-page">

    <form name="questionsForm grid-block large-12 row">

      <div class="form-group body-tool">

        <div class="tool-branding"><img src="/static/body.svg" alt="body" class="tool-icon"></div>

        <p class="question-header"><span class="tool-icon-text">Body:</span> SYMPTOMS SEARCH</p>

        <div class="row small-12 medium-8 large-6 columns align-left question-row">
          <SearchInput @itemSelected="handleSelection"/>
        </div>

      </div>

      <div class="saved-terms">
        <span v-for="(selection, index) in selections"
              :key="selection.id"
              class="label symptom-tag">{{ selection.exact_synonym[0] }} <strong @click="removeSelection(index)">X</strong></span>
      </div>

      <div class="button-container">
        <input type="button" class="button medium skip-button-q" value="Done adding symptoms" />
      </div>

    </form>

  </div>
</template>

<script>
import SearchInput from './SearchInput';

export default {
  name: 'QuestionsPage',

  data() {
    return {
      selections: []
    };
  },

  components: {
    SearchInput
  },

  methods: {
    handleSelection(item) {
      this.selections.push(item);
    },

    removeSelection(index) {
      this.selections.splice(index, 1);
    }
  }
};
</script>
