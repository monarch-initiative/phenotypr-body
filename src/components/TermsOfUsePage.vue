<template>
<div class="grid-container body-search-content">
  <PageHeading title="Introduction"/>

  <div class="grid-content large-3 columns about-text">
    <p class="landing-text">You have started a health questionnaire that asks about various symptoms associated with rare diseases and genetic conditions. This questionnaire is for patients with rare conditions to describe their physical features and disease characteristics, which may help clinicians and researchers find a diagnosis. This information may help further the understanding of what possible effects specific genetic changes may have on health and development. This tool does not provide medical advice. It is intended for informational and educational purposes only.</p>
    <p class="landing-text">The survey should take 10-15 minutes to complete. <b>Answers are not saved until you click the “submit” button at the end of the survey.</b></p>
    <p class="landing-text">If you would like to ask a question before finishing this survey, please email <a href="mailto:MyTraitFinderStudy@childrens.harvard.edu.">MyTraitFinderStudy@childrens.harvard.edu</a>.</p>
    <p class="landing-text">You have agreed to participate and will now move on to the health survey. Please remember that as you answer the questions, you should answer them from the perspective of the person with the rare disease or genetic condition who consented to participate. If you are answering on behalf of your child, for example, when we say “YOU” we are meaning “your child”.</p>
  </div>
  <br/>

  <div class="grid-x grid-margin-x">
    <div class="cell medium-12 large-10">
      <div class="callout secondary">
        <h5>Terms of Use</h5>

        <p>This tool does not provide medical advice. It is intended for informational and
          educational purposes only.</p>

        <p>By submitting information through the Phenotypr platform you understand and accept
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
import PageHeading from "./PageHeading";

export default {
  name: "TermsOfUsePage",

  components: {
    PageHeading
  },

  methods: {
    acceptTermsOfUse() {
      this.$store.commit("acceptTermsOfUse");
      this.$router.push("/body-systems");
    }
  }
};
</script>

<script>
import PageHeading from "./PageHeading";

export default {
  name: "TermsOfUsePage",

  components: {
    PageHeading
  },

  methods: {
    acceptTermsOfUse() {
      this.$store.commit("acceptTermsOfUse");
      this.$router.push("/body-systems");
    }
  }
};
</script>
