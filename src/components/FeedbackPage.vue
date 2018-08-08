<template>
  <div class="grid-container body-search-content">
    <PageHeading title="Application Feedback"/>

    <div class="grid-x grid-margin-x">
      <div class="cell medium-8 large-6">
        Did you find all the symptoms you were searching for?

        <div class="input-group feedback-inputs">
          <label>
            Yes
            <input type="radio" name="foundAllConditions" value="1" :checked="trueChecked" @click="setFeedback">
          </label>
          <label>
            No
            <input type="radio" name="foundAllConditions" value="0" :checked="falseChecked" @click="setFeedback">
          </label>
        </div>

      </div>
    </div>

    <!-- buttons -->
    <div class="grid-x grid-margin-x button-container">
      <div class="cell large-4 text-left">
        <input type="button" name="backButton" value="Go Back" class="button rounded" @click="goBack">
      </div>
      <div class="cell large-4 text-right">
        <input type="button" name="forwardButton" value="Done" class="button rounded" :disabled="feedbackIncomplete" @click="goForward">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PageHeading from './PageHeading';

export default {
  name: 'FeedbackPage',

  components: {
    PageHeading
  },

  methods: {
    setFeedback(evt) {
      const value = evt.target.value === '1';
      this.$store.commit('setFoundAllConditions', value);
    },

    goBack() {
      this.$router.push('/search');
    },

    goForward() {
      this.$store.dispatch('saveSelectedTerms');
      this.$router.push('/results');
    }
  },

  computed: {
    ...mapState({
      foundAllConditions: 'foundAllConditions'
    }),

    feedbackIncomplete() {
      const { foundAllConditions } = this;
      return foundAllConditions === null;
    },

    trueChecked() {
      const { foundAllConditions } = this;
      return foundAllConditions === true;
    },

    falseChecked() {
      const { foundAllConditions } = this;
      return foundAllConditions === false;
    }
  }
};
</script>
