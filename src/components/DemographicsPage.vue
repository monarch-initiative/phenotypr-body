<template>
  <div class="grid-container body-search-content">
    <PageHeading title="Demographics"/>

    <!-- search form -->
    <form @submit.prevent="handleSubmit">
      <div class="grid-x grid-margin-x">
        <div class="cell medium-8 large-6">
          What is your age?
          <div class="input-group feedback-inputs">
            <select id="demographic-age" name="age" v-model="demographics.age">
              <option value="">Select</option>
              <option value="18-12 years">18-12 years</option>
              <option value="21-30 years">21-30 years</option>
              <option value="31-40 years">31-40 years</option>
              <option value="41-50 years">41-50 years</option>
              <option value="51-60 years">51-60 years</option>
              <option value="61-70 years">61-70 years</option>
              <option value=">71 years">>71 years</option>
            </select>
          </div>
          <div class="input-group feedback-inputs">
            OR
            <br/>
            <input type="number" id="demographic-other-age" name="otherAge"  v-model="demographics.otherAge" style="width:100px;margin-right:10px;"/> years
          </div>
        </div>
      </div>

      <div class="grid-x grid-margin-x">
        <div class="cell medium-8 large-6">
          If you are answering this survey on behalf of your child, how old is your child?
          <div class="input-group feedback-inputs">
            <input type="number" id="demographic-child-age" name="childAge" v-model="demographics.childAge" style="width:100px;margin-right:10px;"/> years
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
          With which one or more of the following races do you identify? Please select all that apply. (On a PC hold ctrl pr command key)
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
      // console.log(evt.target);
      console.log(this.demographics);
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
