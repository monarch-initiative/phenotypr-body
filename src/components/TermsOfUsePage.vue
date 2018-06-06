<template>
<div class="grid-container body-search-content">
  <h2>Terms of Use</h2>
  <p>Do you accept?</p>
  <form @submit.prevent>
    <input type="button" value="No" class="button rounded" @click="rejectTermsOfUse">
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
      this.$router.push('/');
    },

    rejectTermsOfUse() {
      window.location = 'https://phenotypr.com/index.html';
    }
  }
};
</script>
