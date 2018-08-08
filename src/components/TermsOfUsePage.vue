<template>
<div class="grid-container body-search-content">
  <PageHeading title="Terms of Use"/>

  <div class="grid-x grid-margin-x">
    <div class="cell medium-12 large-10">
      <div class="callout secondary">
        <h5>Terms of Use</h5>

        <p>This tool does not provide medical advice. It is intended for informational and
          educational purposes only.</p>

        <p>By submitting information through the Phenotpyr platform you understand and accept
          the <a href="https://phenotypr.com/terms.html" title="Phenotypr terms of use">terms of use</a>
          to this site.</p>
      </div>
    </div>
  </div>

  <div class="grid-x button-container terms-action">
    <div class="cell large-4">
      <input type="button" value="Yes, start using the Body Tool" class="button rounded success" @click="acceptTermsOfUse">
    </div>

    <div class="cell large-4">
      <a href="https://phenotypr.com/index.html" class="decline">No, send me to the Phenotypr homepage</a>
    </div>
  </div>
</div>
</template>

<script>
import PageHeading from './PageHeading';

export default {
  name: 'TermsOfUsePage',

  components: {
    PageHeading
  },

  methods: {
    acceptTermsOfUse() {
      this.$store.commit('acceptTermsOfUse');
      this.$router.push('/body-systems');
    }
  }
};
</script>
