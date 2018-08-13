<template>
  <div class="grid-container body-search-content">
    <PageHeading title="Select Body System / Category"/>

    <div class="grid-x grid-margin-x select-systems">
      <div class="cell medium-5 large-6">
        <h2>Please choose the categories of symptoms that apply to you</h2>
        <div class="checkbox-container" v-for="system in bodySystems" :key="system.id">
          <input type="checkbox"
            :id="system.id"
            :value="system.id"
            @change="toggleSystem"
            :checked="isSystemSelected(system.id)">
          <label :for="system.id">{{system.label}}:</label>
          <a href="#"
            :id="'help-button' + system.id"
            role="button"
            aria-controls="system-help"
            @click="toggleHelp">
            (... more info)
          </a>
          <transition name="collapse">
            <div :id="'help-' + system.id" class="help-text" v-if="helpShown(system.id)">{{system.helpText}}</div>
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
      bodySystems: systems,
      showHelp: []
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

    toggleHelp(id) {
      let { showHelp, helpShown } = this;
      if (helpShown(id)) {
        showHelp.splice(showHelp.indexOf(id));
      } else {
        showHelp.push(id);
      }
    },

    helpShown(id) {
      const { showHelp } = this;
      return showHelp.includes(id);
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
