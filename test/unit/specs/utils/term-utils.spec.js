import { isValidTerm, isValidId } from '@/utils/term-utils';
import exampleTerms from '../../example-terms';

describe('isValidTerm utility', () => {
  test('is false when undefined', () => {
    expect(isValidTerm()).toBe(false);
    expect(isValidTerm(undefined)).toBe(false);
  });

  test('is false for null', () => {
    expect(isValidTerm(null)).toBe(false);
  });

  test('is false if the document is malformed', () => {
    let malformed = Object.assign({}, exampleTerms[0]);

    // missing ID
    delete malformed.id;
    expect(isValidTerm(malformed)).toBe(false);

    // wrong ID type
    malformed.id = 42;
    expect(isValidTerm(malformed)).toBe(false);

    // wrong ID format
    malformed.id = 'hi';
    expect(isValidTerm(malformed)).toBe(false);

    // missing label
    malformed = Object.assign({}, exampleTerms[0]);
    delete malformed.label;
    expect(isValidTerm(malformed)).toBe(false);
  });

  test('is false if the ID does not match the expected pattern', () => {
    expect(isValidTerm({ id: '90210', label: 'nope' })).toBe(false);
  });

  test('is true if the document has the expected structure', () => {
    expect(isValidTerm(exampleTerms[0])).toBe(true);
  });
});

describe('isValidId utility', () => {
  test('is false for undefined', () => {
    expect(isValidId()).toBe(false);
  });

  test('is false for null', () => {
    expect(isValidId(null)).toBe(false);
  });

  test('is false for types other than string', () => {
    expect(isValidId({})).toBe(false);
    expect(isValidId([])).toBe(false);
    expect(isValidId(42)).toBe(false);
    expect(isValidId(false)).toBe(false);
  });

  test('is true if input is a string with the expected format', () => {
    expect(isValidId('hi')).toBe(false);
    expect(isValidId('HP:000070')).toBe(false); // not enough digits
    expect(isValidId('HP:0000708')).toBe(true);
  });
});
