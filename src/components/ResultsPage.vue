<template>
  <div class="grid-container body-search-content">

    <!-- heading -->
    <div class="grid-x grid-margin-x">
      <div class="cell">
        <div class="media-object">
          <div class="media-object-section">
            <div>
              <img src="/static/body.svg">
            </div>
          </div>

          <div class="media-object-section">
            <h1><strong>Body:</strong> Symptoms Search</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- sub heading -->
    <div class="grid-x grid-margin-x terms-subheading">
      <div class="cell large-8">
        <h2>Your HPO Terms</h2>
      </div>

      <div class="cell large-4 text-right">
        <input type="button" value="Download" class="button">
      </div>
    </div>

    <!-- search results table -->
    <div class="grid-x grid-margin-x">
      <div class="cell">
        <table>
          <caption></caption>
          <thead>
            <tr>
              <th>Sypmtom</th>
              <th>HPO Term</th>
              <th>HPO #</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="term in selectedTerms" :key="term.id">
              <td>{{ term.exact_synonym[0] }}</td>
              <td>{{ term.label }}</td>
              <td>{{ term.id }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  <!-- /end grid container -->
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ResultsPage',

  computed: mapState({
    selectedTerms: 'selectedTerms'
  })
};
</script>
