<template>
<div class="grid-container body-search-content">
  <PageHeading title="Symptoms Search" />

  <!-- search form -->
  <form @submit.prevent>
    <div class="grid-x grid-margin-x">
      <div class="cell medium-8 large-6">
        <SearchInput :filterCategories="selectedSystemIds" @itemSelected="handleSelection" :enableCategoryList="enableFilter" />

      <!-- annotation sufficiency information -->
      <div class="quality-score">
        <AnnotationSufficiency :score="qualityScore" :error="scoringError" />
      </div>
    </div>

    <!-- About this search callouts -->
    <div class="cell medium-3 large-3" v-if="!enableFilter">
      <div class="callout success filter-search-msg">
        <h6 class="title">About this Search</h6>
        <p>Your search will be filtered by the categories you selected: <span class="filter-terms">{{selectedSystemLabels.join(', ')}}</span></p>
      </div>
    </div>
  </div>

    <!-- saved terms -->
    <div class="grid-x grid-margin-x saved-terms">
      <div class="cell">
        <span v-for="(selection, index) in selections" :key="selection.id" class="label symptom-tag">{{ selection.symptomText }} <strong @click="removeSelection(index)">X</strong></span>
      </div>
    </div>

    <!-- buttons -->
    <div class="grid-x grid-margin-x button-container">
      <div class="cell large-4 text-left">
        <input type="button" name="forwardButton" value="Done adding symptoms" class="button rounded" :disabled="selectionIsEmpty" @click="goForward">
      </div>
    </div>
  </form>
</div>
</template>

<script>
import { mapState } from 'vuex';
import PageHeading from './PageHeading';
import SearchInput from './SearchInput';
import AnnotationSufficiency from './AnnotationSufficiency';
import bodySystems from '@/store/systems';

export default {
  name: 'SearchPage',

  components: {
    PageHeading,
    SearchInput,
    AnnotationSufficiency
  },

  props: {
    enableFilter: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleSelection(item) {
      const { enableFilter } = this;
      this.$store.commit('addTerm', { term: item, filterEnabled: enableFilter });
      this.$store.dispatch('calculateQualityScore');
    },

    removeSelection(index) {
      this.$store.commit('removeTermAtIndex', index);
      this.$store.dispatch('calculateQualityScore');
    },

    goForward() {
      const { enableFilter } = this;
      if (enableFilter) {
        this.$router.push({ path: '/feedback', query: { finishSearch: true } });
      } else {
        this.$router.push('/feedback');
      }
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
    },

    selectedSystemLabels() {
      const { selectedSystemIds } = this;
      return selectedSystemIds.map(system => {
        const foundSystem = bodySystems.find(s => {
          return s.id === system;
        });
        return foundSystem.label;
      });
    }

  }
};
</script>
