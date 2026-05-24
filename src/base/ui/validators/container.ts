import {
  HEX_COLOR_PATTERN,
  HTTP_URL_PATTERN,
  ATTACHMENT_URL_PATTERN,
  MAX_GALLERY_ITEMS,
  MAX_MESSAGE_COMPONENTS,
  MAX_ROW_COMPONENTS,
  MAX_SECTION_TEXTS,
  MAX_TEXT_LENGTH,
} from '../constants';

import type {
  DisplayComponent,
  MediaItem,
  RowComponent,
  SectionComponent,
} from '../types';

function hasLengthBetween(value: string | undefined, min: number, max: number) {
  if (typeof value !== 'string') return false;
  return value.length >= min && value.length <= max;
}

function isSelectComponent(component: RowComponent) {
  return !('label' in component);
}

/**
 * Validates the number of display components in a rendered message.
 *
 * @param components Display components to validate.
 */
export function validateComponents(components: readonly DisplayComponent[]) {
  if (components.length > MAX_MESSAGE_COMPONENTS) {
    throw new Error('A message cannot contain more than 40 components.');
  }
}

/**
 * Validates display text content.
 *
 * @param content Text content to validate.
 */
export function validateText(content: string) {
  if (content.length > MAX_TEXT_LENGTH) {
    throw new Error('Display text cannot exceed 4000 characters.');
  }
}

/**
 * Validates a display media URL.
 *
 * @param url URL to validate.
 */
export function validateUrl(url: string) {
  if (!HTTP_URL_PATTERN.test(url)) {
    throw new Error('URL must start with http:// or https://');
  }
}

/**
 * Validates a file attachment URL.
 *
 * @param url URL to validate.
 */
export function validateAttachmentUrl(url: string) {
  if (!ATTACHMENT_URL_PATTERN.test(url)) {
    throw new Error('File URL must start with attachment://');
  }
}

/**
 * Validates a row component list.
 *
 * @param components Row components to validate.
 */
export function validateRow(components: readonly RowComponent[]) {
  if (components.length < 1 || components.length > MAX_ROW_COMPONENTS) {
    throw new Error('Action row must contain between 1 and 5 components.');
  }

  const selectCount = components.filter(isSelectComponent).length;

  if (selectCount > 0 && components.length > 1) {
    throw new Error(
      'Select menus must be alone in an action row (max width layout rule).',
    );
  }
}

/**
 * Validates a section component.
 *
 * @param section Section component to validate.
 */
export function validateSection(section: SectionComponent) {
  if (section.texts.length < 1 || section.texts.length > MAX_SECTION_TEXTS) {
    throw new Error('Section must contain between 1 and 3 text blocks.');
  }
}

/**
 * Validates an accent color value.
 *
 * @param color Color to validate.
 * @returns Normalized numeric color.
 */
export function validateColor(color: number | string) {
  if (typeof color === 'number') {
    if (!Number.isInteger(color) || color < 0x000000 || color > 0xffffff) {
      throw new Error(
        'Container color must be an integer between 0x000000 and 0xFFFFFF.',
      );
    }

    return color;
  }

  const match = color.match(HEX_COLOR_PATTERN);

  if (!match) {
    throw new Error(
      'Container accentColor must be a number (0x000000-0xFFFFFF) or hex string (#000000, 0x000000, 000000).',
    );
  }

  const hex = match[1];

  if (!hex) {
    throw new Error('Invalid accent color hex value.');
  }

  return Number.parseInt(hex, 16);
}

/**
 * Validates gallery items.
 *
 * @param items Gallery items to validate.
 */
export function validateGallery(items: readonly MediaItem[]) {
  if (items.length < 1 || items.length > MAX_GALLERY_ITEMS) {
    throw new Error('Gallery must contain between 1 and 10 items.');
  }
}
