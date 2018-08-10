import uuid from 'uuid/v4';
import bodySystems from '@/store/systems';
import exampleTerms from './example-terms';
import { convertTerm } from '@/utils/persistence-utils';

export default {
  session_id: uuid(),
  selected_systems: bodySystems.slice(0, 1).map(system => system.id),
  selected_terms: exampleTerms.slice(0, 1).map(convertTerm),
  found_all: true
};
