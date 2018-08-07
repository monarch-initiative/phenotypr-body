<template>
  <div class="grid-container body-search-content">
    <div class="grid-x grid-margin-x terms-subheading">
      <div class="cell large-12">
        <h2>Choose the Abnormality of concern</h2>
      </div>
    </div>

    <div class="grid-x grid-margin-x">
      <div class="cell small-4" v-for="system in bodySystems" :key="system.id">
        <input type="checkbox"
          :id="system.id"
          :value="system.id"
          @change="toggleSystem"
          :checked="isSystemSelected(system.id)">
        <label :for="system.id">{{system.label}}</label>
      </div>
    </div>
    <div class="grid-x grid-margin-x button-container">
      <div class="cell large-12 text-center">
        <input value="Done adding abnormalities" class="button rounded" type="button" :disabled="selectionIsEmpty" @click="goToSearch">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import systems from '@/store/systems';

export default {
  name: 'BodySystemForm',

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
