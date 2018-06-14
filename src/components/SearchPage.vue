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
            <h1><strong>Body:</strong> Symptoms Search</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- search form -->
    <form @submit.prevent>
      <div class="grid-x grid-margin-x">
        <div class="cell medium-8 large-6">
          <SearchInput @itemSelected="handleSelection"/>
        </div>
      </div>

      <!-- annotation sufficiency information -->
      <div class="grid-x grid-margin-x">
        <AnnotationSufficiency class="cell medium-8 large-6" :score="qualityScore" :error="scoringError"/>
      </div>

      <!-- saved terms -->
      <div class="grid-x grid-margin-x saved-terms">
        <div class="cell">
          <span v-for="(selection, index) in selections"
                :key="selection.id"
                class="label symptom-tag">{{ selection.symptomText }} <strong @click="removeSelection(index)">X</strong></span>
        </div>
      </div>

      <!-- forms -->
      <div class="grid-x grid-margin-x button-container">
        <div class="cell large-8 text-right">
          <input type="button" value="Done adding symptoms" class="button rounded" :disabled="selectionIsEmpty" @click="goToResults">
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SearchInput from './SearchInput';
import AnnotationSufficiency from './AnnotationSufficiency';

export default {
  name: 'SearchPage',

  components: {
    SearchInput,
    AnnotationSufficiency
  },

  methods: {
    handleSelection(item) {
      this.$store.commit('addTerm', item);
      this.$store.dispatch('calculateQualityScore');
    },

    removeSelection(index) {
      this.$store.commit('removeTermAtIndex', index);
      this.$store.dispatch('calculateQualityScore');
    },

    goToResults() {
      this.$router.push('/results');
    }
  },

  computed: mapState({
    selections: 'selectedTerms',
    qualityScore: state => state.qualityScore,
    scoringError: state => state.scoringError,
    selectionIsEmpty: state => state.selectedTerms && state.selectedTerms.length < 1
  })
};
</script>
