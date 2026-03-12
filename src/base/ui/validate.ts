import {
  Button,
  DisplayComponent,
  MediaItem,
  RowComponent,
  SectionComponent,
  SelectMenu,
} from '@types';

const HTTP_URL_PATTERN = /^https?:\/\/.+/i;
const ATTACHMENT_URL_PATTERN = /^attachment:\/\/.+/i;
const HEX_COLOR_PATTERN = /^(?:#|0x)?([0-9a-fA-F]{6})$/;

function hasLengthBetween(value: string | undefined, min: number, max: number) {
  if (!value) return false;
  return value.length >= min && value.length <= max;
}

export const validate = {
  components(components: readonly DisplayComponent[]) {
    if (components.length > 40) {
      throw new Error('A message cannot contain more than 40 components.');
    }
  },

  text(content: string) {
    if (content.length > 4000) {
      throw new Error('Display text cannot exceed 4000 characters.');
    }
  },

  url(url: string) {
    if (!HTTP_URL_PATTERN.test(url)) {
      throw new Error('URL must start with http:// or https://');
    }
  },

  attachmentUrl(url: string) {
    if (!ATTACHMENT_URL_PATTERN.test(url)) {
      throw new Error('File URL must start with attachment://');
    }
  },

  button(button: Button) {
    if (!hasLengthBetween(button.label, 1, 80)) {
      throw new Error('Button label must have between 1 and 80 characters.');
    }

    if (!hasLengthBetween(button.customId, 1, 100)) {
      throw new Error('Button custom id must have between 1 and 100 characters.');
    }
  },

  row(components: readonly RowComponent[]) {
    if (components.length < 1 || components.length > 5) {
      throw new Error('Action row must contain between 1 and 5 components.');
    }

    const selectCount = components.filter((component) => !('label' in component)).length;

    if (selectCount > 0 && components.length > 1) {
      throw new Error(
        'Select menus must be alone in an action row (max width layout rule).',
      );
    }
  },

  select(select: SelectMenu) {
    if (!hasLengthBetween(select.id, 1, 100)) {
      throw new Error('Select custom id must have between 1 and 100 characters.');
    }

    if (select.placeholder && select.placeholder.length > 150) {
      throw new Error('Select placeholder cannot exceed 150 characters.');
    }

    if (select.type === 'select.string') {
      if (select.options.length < 1 || select.options.length > 25) {
        throw new Error('String select must contain between 1 and 25 options.');
      }
    }
  },

  section(section: SectionComponent) {
    if (section.texts.length < 1 || section.texts.length > 3) {
      throw new Error('Section must contain between 1 and 3 text blocks.');
    }
  },

  color(color: number | string) {
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
  },

  gallery(items: readonly MediaItem[]) {
    if (items.length < 1 || items.length > 10) {
      throw new Error('Gallery must contain between 1 and 10 items.');
    }
  },
};
