/**
 * Injects the search service into components if present.
 *
 * @see https://codeburst.io/dependency-injection-with-vue-js-f6b44a0dae6d
 */
export default {
  beforeCreate() {
    const options = this.$options;
    if (options.searchService) {
      this.$searchService = options.searchService;
    } else if (options.parent && options.parent.$searchService) {
      this.$searchService = options.parent.$searchService;
    }
  }
};
