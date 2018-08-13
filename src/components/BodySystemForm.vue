<template>
  <div class="grid-container body-search-content">
    <PageHeading title="Select Body System / Category"/>

    <div class="grid-x grid-margin-x select-systems">
      <div class="cell medium-5 large-6">
        <h2>Please choose the categories of symptoms that apply to you</h2>
        <div class="checkbox-container" v-for="(system, index) in bodySystems" :key="system.id">
          <input type="checkbox"
            :id="system.id"
            :value="system.id"
            :checked="isSystemSelected(system.id)"
            @change="toggleSystem">
          <label :for="system.id">{{system.label}}:</label>
          <a href="#"
            role="button"
            aria-controls="system-help"
            @click.prevent="toggleHelp(index)">
            (... more info)
          </a>
          <transition name="collapse">
            <div class="help-text" v-if="system.showHelp">{{system.helpText}}</div>
          </transition>
        </div>
      </div>
      <div class="cell medium-4 large-5 large-offset-1">
        <div class="callout secondary systems-help">
          <h5>Help</h5>
          <div class="help-content">
            To get HPO terms related to your disease:
            <ol>
              <li>Select a body system / category.</li>
              <li>Click on <span class="show-help">...more info</span> for more information about the system / category.</li>
              <li>On the next page, enter search terms related to the systems / categories you selected.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-x grid-margin-x button-container terms-filter">
      <div class="cell large-12 text-left">
        <input type="button"
          value="Done adding categories"
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
      bodySystems: systems.map(system => ({ ...system, showHelp: false }))
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

    toggleHelp(index) {
      const { bodySystems } = this;
      const system = bodySystems[index];
      system.showHelp = !system.showHelp;
    },

    goToSearch() {
      this.$router.push('/search');
    }
  },

  computed: {
    ...mapState({
      selectedSystems: 'selectedSystems',
      selectionIsEmpty: state => state.selectedSystems && state.selectedSystems.length < 1
    })
  }
};
</script>
