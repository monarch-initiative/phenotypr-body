<template>
<div class="grid-container body-search-content">
  <h2>Terms of Use</h2>
  <p>This tool does not provide medical advice. It is intended for informational and
    educational purposes only. By submitting information through the Phenotpyr platform you
    understand and accept the <a href="https://phenotypr.com/terms.html" title="Phenotypr terms of use">terms of use</a>
    to this site.</p>
  <form @submit.prevent>
    <a ref="terms-no-button" href="https://phenotypr.com/index.html" class="button rounded alert">No</a>
    <input type="button" value="Yes" class="button rounded" @click="acceptTermsOfUse">
  </form>
</div>
</template>

<script>
export default {
  name: 'TermsOfUsePage',
  methods: {
    acceptTermsOfUse() {
      this.$store.commit('acceptTermsOfUse');
      this.$router.push('/search');
    }
  }
};
</script>
