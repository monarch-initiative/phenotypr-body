<template>
  <div class="grid-container body-search-content">
    <PageHeading title="Results"/>

    <!-- sub heading -->
    <div class="grid-x grid-margin-x terms-subheading">
      <div class="cell large-8">
        <h2>Your HPO Terms</h2>
      </div>

      <div class="cell large-4 text-right">
        <input type="button" value="Download" class="button" @click="downloadPdf">
      </div>
    </div>

    <!-- search results table -->
    <div class="grid-x grid-margin-x">
      <div class="cell">
        <table>
          <caption></caption>
          <thead>
            <tr>
              <th>Symptom</th>
              <th>HPO Term</th>
              <th>HPO #</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="term in selectedTerms" :key="term.id">
              <td>{{ term.symptomText }}</td>
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
import PageHeading from './PageHeading';
import PdfRenderer from '@/utils/pdf-renderer';
import createExportDocument from '@/utils/create-export-document';

export default {
  name: 'ResultsPage',

  components: {
    PageHeading
  },

  methods: {
    downloadPdf() {
      const renderer = new PdfRenderer();
      const doc = createExportDocument(this.selectedTerms);
      const pdf = renderer.renderDocument(doc);
      pdf.download('phenotypr-body-export.pdf');
    }
  },

  computed: mapState({
    selectedTerms: 'selectedTerms'
  })
};
</script>
