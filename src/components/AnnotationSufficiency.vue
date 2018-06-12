<template>
  <div class="cell medium-8 large-6">
    <p>Profile sufficiency: <span class="score-category">{{ category }}</span>
      <star-rating
        v-model="scaledScore"
        active-color="#5aa4d2"
        :increment="0.5"
        :read-only="true"
        :show-rating="false"
        :inline="true"
        :star-size="16"
        :rounded-corners="true"/>
    </p>

    <p class="score-help">To help your doctor diagnose you most accurately:
      <ul>
        <li>Enter as many symptoms as you can</li>
        <li>Be as specific as you can be</li>
        <li>Try to cover as many body symptoms as apply to you (e.g. symptoms in the head
          and neck, face, eyes, ears, muscles, joints, bones, internal organs, etc.)</li>
        <li>Don't forget conditions that are not local to a specific body part (e.g. stroke,
          fever, numbness, sensitivity to pain, etc.)</li>
        <li>Don't forget conditions like sleep disturbances, memory loss, cognitive disability,
          developmental delay</li>
      </ul>
    </p>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating';

/**
 * Displays information about the diagnostic usefulness of the selected terms, based on
 * the score obtained from the Monarch Initiative API.
 */
export default {
  name: 'AnnotationSufficiency',

  components: {
    StarRating
  },

  props: {
    score: Number
  },

  data() {
    return {
      categoryLabels: [
        'Very Poor',
        'Poor',
        'Fair',
        'Good',
        'Very Good'
      ]
    };
  },

  methods: {
    /**
     * Coerces the input value to a valid index into the `categoryLabels` array.
     * @param {Number} input - an integer value to clamp.
     * @return {Number} an integer from 0 to `categoryCount - 1`
     * @private
     */
    _clampIndex(input) {
      const { categoryCount } = this;
      const maxIndex = categoryCount - 1;

      if (input < 0) {
        return 0;
      } else if (input > maxIndex) {
        return maxIndex;
      } else {
        return input;
      }
    }
  },

  computed: {
    /**
     * Returns the number of score categories.
     * @return {Number}
     */
    categoryCount() {
      return this.categoryLabels.length;
    },

    /**
     * Scales the score, which ranges from 0 to 1 to a number between 0 and 5.
     * @return {Number}
     */
    scaledScore() {
      return this.score * this.categoryCount;
    },

    /**
     * Returns the category the score falls into, as a string.
     * @return {String} a string in `categoryLabels`
     */
    category() {
      const { scaledScore, categoryLabels } = this;
      const categoryIndex = this._clampIndex(Math.floor(scaledScore));
      return categoryLabels[categoryIndex];
    }
  }
};
</script>
