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
          <SearchInput :filterTerms="selectedSystemIds" @itemSelected="handleSelection"/>
        </div>
      </div>

      <!-- annotation sufficiency information -->
      <div class="grid-x grid-margin-x quality-score">
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

      <!-- buttons -->
      <div class="grid-x grid-margin-x button-container">
        <div class="cell large-4 text-left">
          <input type="button" name="backButton" value="Go Back" class="button rounded" @click="goBack">
        </div>
        <div class="cell large-4 text-right">
          <input type="button" name="forwardButton" value="Done adding symptoms" class="button rounded" :disabled="selectionIsEmpty" @click="goForward">
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

    goForward() {
      this.$router.push('/feedback');
    },

    goBack() {
      this.$router.push('/body-systems');
    }
  },

  computed: {
    ...mapState({
      selections: 'selectedTerms',
      selectedSystems: 'selectedSystems',
      qualityScore: 'qualityScore',
      scoringError: 'scoringError',
      selectionIsEmpty: state => state.selectedTerms && state.selectedTerms.length < 1
    }),

    selectedSystemIds() {
      const { selectedSystems } = this;
      return selectedSystems.map(system => system.id);
    }
  }
};
</script>
