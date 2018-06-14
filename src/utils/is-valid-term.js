/**
 * Reports whether the input looks like an HPO term object.
 *
 * NOTE: This function tests for HPO terms returned from the search service, which merges
 * plain language symptom descriptions into the HPO term objects.
 *
 * @param {Any} input
 * @return {Boolean} true if the input is an object with `id`, `label`, and `symptomText`
 * properties, and the ID is a string matching the pattern of an HPO term. False otherwise.
 */
export default function isValidTerm(input) {
  return !!(input && input.id && input.label && input.symptomText &&
      /HP:\d{7}/.test(input.id));
}
