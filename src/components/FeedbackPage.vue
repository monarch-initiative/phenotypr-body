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
        <input type="button" name="forwardButton" value="Next" class="button rounded" :disabled="feedbackIncomplete" @click="goForward">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PageHeading from './PageHeading';

export default {
  name: 'FeedbackPage',

  props: {
    finishSearch: {
      type: Boolean,
      default: false
    }
  },

  components: {
    PageHeading
  },

  methods: {
    setFeedback(evt) {
      const value = evt.target.value === '1';
      this.$store.commit('setFoundAllConditions', value);
    },

    goForward() {
      const { doneSearching } = this;
      if (doneSearching) {
        this.$router.push('/demographics');
      } else {
        this.$router.push({ path: '/search', query: { enableFilter: true } });
      }
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
    },
    doneSearching() {
      const { finishSearch, foundAllConditions } = this;
      if (finishSearch || foundAllConditions) {
        return true;
      }
      return false;
    }
  }
};
</script>
