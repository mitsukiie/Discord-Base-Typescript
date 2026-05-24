import { MAX_BUTTON_CUSTOM_ID_LENGTH, MAX_BUTTON_LABEL_LENGTH } from '../constants';

import type { Button } from '../types';
import { validateUrl } from './container';

function isLink(button: Button): button is Extract<Button, { url: string }> {
  return 'url' in button && typeof button.url === 'string';
}

function hasLen(value: string | undefined, min: number, max: number) {
  if (!value) return false;
  return value.length >= min && value.length <= max;
}

/**
 * Validates a public button descriptor.
 *
 * @param button Button data to validate.
 */
export function validateButton(button: Button) {
  if (!hasLen(button.label, 1, MAX_BUTTON_LABEL_LENGTH)) {
    throw new Error('Button label must have between 1 and 80 characters.');
  }

  if (isLink(button)) {
    validateUrl(button.url);
    return;
  }

  if (!hasLen(button.customId, 1, MAX_BUTTON_CUSTOM_ID_LENGTH)) {
    throw new Error('Button custom id must have between 1 and 100 characters.');
  }
}
