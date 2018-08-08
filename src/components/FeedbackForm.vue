<template>
  <div class="grid-container body-search-content">
    <!-- heading -->
    <div class="grid-x grid-margin-x">
      <div class="cell">
        <div class="media-object">
          <div class="media-object-section">
            <div>
              <img src="../../static/body.svg">
            </div>
          </div>

          <div class="media-object-section">
            <h1><strong>Body:</strong> Application Feedback</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-x grid-margin-x">
      <div class="cell medium-8 large-6">
        Did you find all the symptoms you were searching for?

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

    <!-- buttons -->
    <div class="grid-x grid-margin-x button-container">
      <div class="cell large-4 text-left">
        <input type="button" name="backButton" value="Go Back" class="button rounded" @click="goBack">
      </div>
      <div class="cell large-4 text-right">
        <input type="button" name="submitButton" value="Done" class="button rounded" :disabled="feedbackIncomplete" @click="goToResults">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'FeedbackForm',

  methods: {
    setFeedback(evt) {
      const value = evt.target.value === '1';
      this.$store.commit('setFoundAllConditions', value);
    },

    goBack() {
      this.$router.push('/search');
    },

    goToResults() {
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
