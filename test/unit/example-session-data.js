import uuid from 'uuid/v4';
import bodySystems from '@/store/systems';
import exampleTerms from './example-terms';

const mapTermShape = ({ id, label, symptomText }) => ({ id, label, symptom: symptomText });

export default {
  session_id: uuid(),
  selected_systems: bodySystems.slice(0, 1).map(system => system.id),
  selected_terms: exampleTerms.slice(0, 1).map(mapTermShape),
  found_all: true
};
