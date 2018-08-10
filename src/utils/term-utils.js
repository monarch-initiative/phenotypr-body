const HPO_ID_PATTERN = /HP:\d{7}/;

/**
 * Reports whether the input looks like an HPO ID.
 *
 * @param {Any} input
 * @return {Boolean} true if the input is a string matching the pattern of an HPO ID.
 *   False otherwise.
 */
export function isValidId(input) {
  return HPO_ID_PATTERN.test(input);
}

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
export function isValidTerm(input) {
  return Boolean(input && input.id && input.label && isValidId(input.id));
}

export default { isValidTerm, isValidId };
