import { MAX_SELECT_PLACEHOLDER_LENGTH, MAX_STRING_SELECT_OPTIONS } from '../constants';

import type { SelectMenu } from '../types';

function hasLen(value: string | undefined, min: number, max: number) {
  if (typeof value !== 'string') return false;
  return value.length >= min && value.length <= max;
}

function checkStringSelect(select: Extract<SelectMenu, { type: 'select.string' }>) {
  if (select.options.length < 1 || select.options.length > MAX_STRING_SELECT_OPTIONS) {
    throw new Error('String select must contain between 1 and 25 options.');
  }
}

/**
 * Validates a public select menu descriptor.
 *
 * @param select Select menu data to validate.
 */
export function validateSelect(select: SelectMenu) {
  if (!hasLen(select.id, 1, 100)) {
    throw new Error('Select custom id must have between 1 and 100 characters.');
  }

  if (
    typeof select.placeholder === 'string' &&
    select.placeholder.length > MAX_SELECT_PLACEHOLDER_LENGTH
  ) {
    throw new Error('Select placeholder cannot exceed 150 characters.');
  }

  if (select.type === 'select.string') {
    checkStringSelect(select);
  }
}
