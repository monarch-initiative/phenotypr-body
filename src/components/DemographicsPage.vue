<template>
  <div class="grid-container body-search-content">
    <PageHeading title="Demographics"/>

    <!-- search form -->
    <form @submit.prevent="handleSubmit">
      <div class="grid-x grid-margin-x">
        <div class="cell medium-8 large-6">
          Please fill out this section from your perspective as the person completing the survey.
        </div>
      </div>

      <div class="grid-x grid-margin-x">
        <div class="cell medium-8 large-6">
          What is your age?
          <div class="input-group feedback-inputs">
            <select id="demographic-age" name="age" v-model="demographics.age">
              <option value="">Select</option>
              <option value="18-21 years">18-21 years</option>
              <option value="21-30 years">21-30 years</option>
              <option value="31-40 years">31-40 years</option>
              <option value="41-50 years">41-50 years</option>
              <option value="51-60 years">51-60 years</option>
              <option value="61-70 years">61-70 years</option>
              <option value=">71 years">>71 years</option>
            </select>
          </div>
        </div>
      </div>

      <div class="grid-x grid-margin-x">
        <div class="cell medium-8 large-6">
          If you are answering this survey on behalf of your child, what is your child's age?
          <div class="input-group feedback-inputs">
            <select id="demographic-child-age" name="childAge"  v-model="demographics.childAge">
              <option value="">Select</option>
              <option value="0-3 months">0-3 months</option>
              <option value="4-7 months">4-7 months</option>
              <option value="8-11 months">8-11 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="3 years">3 years</option>
              <option value="4 years">4 years</option>
              <option value="5 years">5 years</option>
              <option value="6 years">6 years</option>
              <option value="7 years">7 years</option>
              <option value="8 years">8 years</option>
              <option value="9 years">9 years</option>
              <option value="10 years">10 years</option>
              <option value="11 years">11 years</option>
              <option value="12 years">12 years</option>
              <option value="13 years">13 years</option>
              <option value="14 years">14 years</option>
              <option value="15 years">15 years</option>
              <option value="16 years">16 years</option>
              <option value="17 years">17 years</option>
              <option value="18+ years">18+ years</option>
            </select>
          </div>
        </div>
      </div>
      <div class="grid-x grid-margin-x">
        <div class="cell medium-8 large-6">
          How do you identify?
          <select id="demographic-gender" name="gender" v-model="demographics.gender">
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to answer">Prefer not to answer</option>
          </select>
        </div>
      </div>
      <div class="grid-x grid-margin-x">
        <div class="cell medium-8 large-6">
          Do you identify as Latino/a or Hispanic?
          <select id="demographic-hispanic" name="hispanic" v-model="demographics.hispanic">
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="NO">No</option>
            <option value="Prefer not to answer">Prefer not to answer</option>
          </select>
        </div>
      </div>
      <div class="grid-x grid-margin-x">
        <div class="cell medium-8 large-6">
          With which one or more of the following races do you identify? Please select all that apply. (On a PC hold ctrl or command key)
          <select id="demographic-race" name="race" v-model="demographics.race" multiple="true" style="height:160px;">
            <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
            <option value="Asian">Asian</option>
            <option value="Black or African American">Black or African American</option>
            <option value="Native Hawaiian or Pacific Islander">Native Hawaiian or Pacific Islander</option>
            <option value="White or Caucasian">White or Caucasian</option>
            <option value="Other">Other</option>
            <option value="Prefer not to answer">Prefer not to answer</option>
          </select>
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
  name: 'DemographicsPage',

  data() {
    return {
      demographics: {
        age: '',
        otherAge: '',
        childAge: '',
        gender: '',
        hispanic: '',
        race: []
      }
    };
  },

  components: {
    PageHeading
  },

  methods: {
    handleSubmit(evt) {
      // Send data to the server or update your stores and such.
      this.$store.commit('setDemographics', this.demographics);
      this.$router.push('/additionalFeedback');
    },

    goForward() {
      this.$router.push('/additionalFeedback');
    }
  },

  computed: {
    ...mapState({
    })
  }
};
</script>
