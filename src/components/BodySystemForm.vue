<template>
  <div class="grid-container body-search-content">
    <PageHeading title="Body Systems"/>

    <div class="grid-x grid-margin-x terms-subheading">
      <div class="cell large-12">
        <h2>Choose the Abnormality of concern</h2>
      </div>
    </div>

    <div class="grid-x grid-margin-x">
      <div class="cell small-4 checkbox-container" v-for="system in bodySystems" :key="system.id">
        <input type="checkbox"
          :id="system.id"
          :value="system.id"
          @change="toggleSystem"
          :checked="isSystemSelected(system.id)">
        <label :for="system.id">{{system.label}}</label>
      </div>
    </div>
    <div class="grid-x grid-margin-x button-container terms-filter">
      <div class="cell large-12 text-right">
        <input type="button"
          value="Done adding abnormalities"
          class="button rounded"
          :disabled="selectionIsEmpty"
          @click="goToSearch">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import systems from '@/store/systems';
import PageHeading from './PageHeading';

export default {
  name: 'BodySystemForm',

  components: {
    PageHeading
  },

  data() {
    return {
      bodySystems: systems
    };
  },

  methods: {
    isSystemSelected(id) {
      const { selectedSystems } = this;
      return Boolean(selectedSystems.find(item => item.id === id));
    },

    toggleSystem(evt) {
      this.$store.commit('toggleSystem', { id: evt.target.value });
    },

    goToSearch() {
      this.$router.push('/search');
    }
  },

  computed: mapState({
    selectedSystems: 'selectedSystems',
    selectionIsEmpty: state => state.selectedSystems && state.selectedSystems.length < 1
  })
};
</script>
