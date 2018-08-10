import uuid from 'uuid/v4';
import bodySystems from '@/store/systems';
import exampleTerms from './example-terms';

export default {
  session_id: uuid(),
  selected_systems: bodySystems.slice(0, 1).map(system => system.id),
  selected_terms: exampleTerms.slice(0, 1),
  found_all: true
};
