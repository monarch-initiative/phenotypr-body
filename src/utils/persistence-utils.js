/**
 * Converts a term in search service format to the format used for persistence.
 *
 * @param {{id: string, label: string, symptomText: string}} term
 * @return {{id: string, label: string, symptom: string}} an object with the original term
 *   ID, term label, and the `symptomText` property renamed to `symptom`
 */
export function convertTerm({ id, label, symptomText }) {
  return {
    id,
    label,
    symptom: symptomText
  };
}

export default { convertTerm };
