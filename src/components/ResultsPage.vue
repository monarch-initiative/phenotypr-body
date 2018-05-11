<template>
  <div class="results-page">
    <table>
      <thead>
        <tr>
          <th>Symptom</th><th>HPO Term</th><th>HPO #</th>
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
