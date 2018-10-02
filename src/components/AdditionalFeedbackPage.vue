<template>
  <div class="grid-container body-search-content">
    <PageHeading title="Additional Feedback"/>

    <!-- search form -->
    <form @submit.prevent="handleSubmit">

      <div class="grid-x grid-margin-x">
        <div class="cell medium-8 large-6">
          Please list below any symptom(s) that you feel are important that were not on the previous pages
          <div class="input-group feedback-inputs">
            <textarea id="additionalSymptoms" name="additionalSymptoms" cols="50" rows="5" v-model="additionalSymptoms"/>
          </div>
        </div>
      </div>

      <div class="grid-x grid-margin-x">
        <div class="cell medium-8 large-6">
          Specify below any additional thoughts you would like to share with us?
          <div class="input-group feedback-inputs">
            <textarea id="additionalComments" name="additionalComments" cols="50" rows="5" v-model="additionalComments"/>
          </div>
        </div>
      </div>

      <!-- buttons -->
      <div class="grid-x grid-margin-x button-container">
        <div class="cell large-4 text-left">
          <input type="submit" name="forwardButton" value="Next" class="button rounded">
        </div>
      </div>

    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PageHeading from './PageHeading';

export default {
  name: 'AdditionalFeedbackPage',

  data() {
    return {
      additionalSymptoms: '',
      additionalComments: ''
    };
  },

  components: {
    PageHeading
  },

  methods: {
    handleSubmit(evt) {
      // Send data to the server or update your stores and such.
      this.$store.commit('setAdditionalSymptoms', this.additionalSymptoms);
      this.$store.commit('setAdditionalComments', this.additionalComments);
      this.$store.dispatch('saveSessionData');
      this.$router.push('/results');
    },

    goForward() {
      this.$router.push('/results');
    }
  },

  computed: {
    ...mapState({
    })
  }
};
</script>
