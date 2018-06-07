<template>
<div class="grid-container body-search-content">
  <h2>Terms of Use</h2>
  <p>Do you accept?</p>
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
      this.$store.commit('acceptTermsOfUse', true);
      this.$router.push('/');
    }
  }
};
</script>
