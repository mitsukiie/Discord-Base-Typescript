import { SeparatorBuilder } from 'discord.js';

import type {
  AttachmentUrlString,
  Button,
  MediaItem,
  TextInput,
  TextComponent,
  TextStyleOptions,
  Thumbnail,
} from '../types';
import {
  formatInlineCode,
  formatList,
  formatQuote,
  formatSpoiler,
  formatText,
  getAttachmentName,
} from '../utils';

/** Text builder with markdown helpers attached. */
export type TextBuilder = {
  (content: TextInput): TextComponent;
  (content: TextInput, options?: TextStyleOptions): TextComponent;
  /**
   * Formats a bullet list as markdown text.
   *
   * @param items List items.
   * @returns Markdown text component.
   */
  list(items: TextInput): TextComponent;
  /**
   * Formats a numbered list as markdown text.
   *
   * @param items List items.
   * @returns Markdown text component.
   */
  ordered(items: TextInput): TextComponent;
  /**
   * Formats inline code as markdown text.
   *
   * @param content Inline code content.
   * @returns Markdown text component.
   */
  code(content: TextInput): TextComponent;
  /**
   * Formats quoted text as markdown text.
   *
   * @param input Text or lines to quote.
   * @returns Markdown text component.
   */
  quote(input: TextInput): TextComponent;
  /**
   * Formats spoiler text as markdown text.
   *
   * @param input Text or lines to hide.
   * @returns Markdown text component.
   */
  spoiler(input: TextInput): TextComponent;
};

/**
 * Creates a public text component.
 *
 * @param content Text content.
 * @param options Optional markdown styling options.
 * @returns Public text component.
 */
function buildText(content: TextInput, options: TextStyleOptions = {}): TextComponent {
  return { type: 'text' as const, content: formatText(content, options) };
}

/**
 * Creates a public text component from a bullet list.
 *
 * @param items List items.
 * @returns Public text component.
 */
function buildTextList(items: TextInput): TextComponent {
  return buildText(formatList(items));
}

/**
 * Creates a public text component from a numbered list.
 *
 * @param items List items.
 * @returns Public text component.
 */
function buildTextOrdered(items: TextInput): TextComponent {
  return buildText(formatList(items, { ordered: true }));
}

/**
 * Creates a public text component containing inline code.
 *
 * @param content Inline code content.
 * @returns Public text component.
 */
function buildTextCode(content: TextInput): TextComponent {
  return buildText(formatInlineCode(content));
}

/**
 * Creates a public text component containing a quote.
 *
 * @param input Quote content.
 * @returns Public text component.
 */
function buildTextQuote(input: TextInput): TextComponent {
  return buildText(formatQuote(input));
}

/**
 * Creates a public text component containing a spoiler.
 *
 * @param input Spoiler content.
 * @returns Public text component.
 */
function buildTextSpoiler(input: TextInput): TextComponent {
  return buildText(formatSpoiler(input));
}

/** Public text factory used by `ui.text(...)`. */
export const text: TextBuilder = Object.assign(buildText, {
  list: buildTextList,
  ordered: buildTextOrdered,
  code: buildTextCode,
  quote: buildTextQuote,
  spoiler: buildTextSpoiler,
});

/**
 * Creates a public separator builder.
 *
 * @param options Separator configuration.
 * @returns Discord separator builder.
 */
export function separator(
  options: Omit<import('../types').SeparatorComponent, 'type'> = {},
) {
  return new SeparatorBuilder(options);
}

/**
 * @deprecated Use ui.separator(...) instead.
 *
 * Creates a public separator builder.
 *
 * @param options Separator configuration.
 * @returns Discord separator builder.
 */
export function divider(
  options: Omit<import('../types').SeparatorComponent, 'type'> = {},
) {
  return separator(options);
}

/**
 * Creates a public button descriptor.
 *
 * @param options Button configuration.
 * @returns Public button descriptor.
 */
export function button(options: Button): Button {
  return options;
}

/**
 * Creates a public thumbnail descriptor.
 *
 * @param options Thumbnail configuration.
 * @returns Public thumbnail descriptor.
 */
export function thumbnail(options: Thumbnail): Thumbnail {
  return options;
}

/**
 * Creates a public media gallery descriptor.
 *
 * @param items Gallery items.
 * @returns Public gallery descriptor.
 */
export function gallery(...items: MediaItem[]) {
  return { type: 'gallery' as const, items };
}

/**
 * Creates a public media item descriptor.
 *
 * @param options Media item configuration.
 * @returns Public media item descriptor.
 */
export function image(options: MediaItem): MediaItem {
  return options;
}

/**
 * Creates a public row descriptor.
 *
 * @param components Row components.
 * @returns Public row descriptor.
 */
export function row(...components: import('../types').RowComponent[]) {
  return { type: 'row' as const, components };
}

function buildEasyFile(
  url: AttachmentUrlString,
  fileOrSpoiler?: unknown | boolean,
  spoiler = false,
) {
  const hasAttachment = typeof fileOrSpoiler !== 'boolean';

  return {
    type: 'file' as const,
    url,
    spoiler: hasAttachment ? spoiler : (fileOrSpoiler ?? false),
    attachment: hasAttachment ? fileOrSpoiler : undefined,
  };
}

/**
 * Creates a public file descriptor.
 *
 * @param url Attachment URL.
 * @param fileOrSpoiler Attachment payload or spoiler flag.
 * @param spoiler Spoiler flag when an attachment payload is provided.
 * @returns Public file descriptor.
 */
function buildFile(
  url: AttachmentUrlString,
  fileOrSpoiler?: unknown | boolean,
  spoiler = false,
) {
  return buildEasyFile(url, fileOrSpoiler, spoiler);
}

/**
 * Creates a public file descriptor from an attachment-like object.
 *
 * @param attachment Attachment-like object.
 * @param spoiler Whether the file should be marked as spoiler.
 * @returns Public file descriptor.
 */
function fromAttachment(attachment: unknown, spoiler = false) {
  const name = getAttachmentName(attachment);
  return buildEasyFile(`attachment://${name}`, attachment, spoiler);
}

/** Public file factory used by `ui.file(...)`. */
export const file = Object.assign(buildFile, { fromAttachment });
