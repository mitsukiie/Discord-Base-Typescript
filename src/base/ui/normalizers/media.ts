import { FileBuilder, MediaGalleryBuilder } from 'discord.js';

import type { FileComponent, MediaItem } from '../types';
import { validateAttachmentUrl, validateGallery, validateUrl } from '../validators';

function toMediaItem(item: MediaItem) {
  return (media: import('discord.js').MediaGalleryItemBuilder) => {
    validateUrl(item.url);
    media.setURL(item.url);

    if (item.description) media.setDescription(item.description);
    if (item.spoiler) media.setSpoiler(item.spoiler);

    return media;
  };
}

/**
 * Creates a Discord gallery builder from public gallery items.
 *
 * @param items Gallery items.
 * @returns Discord media gallery builder.
 */
export function normalizeGallery(items: readonly MediaItem[]) {
  validateGallery(items);

  const gallery = new MediaGalleryBuilder();

  gallery.addItems(...items.map(toMediaItem));

  return gallery;
}

/**
 * Creates a Discord file builder from a public file descriptor.
 *
 * @param fileInput File descriptor.
 * @returns Discord file builder.
 */
export function normalizeFile(fileInput: FileComponent) {
  validateAttachmentUrl(fileInput.url);

  const file = new FileBuilder().setURL(fileInput.url);
  if (fileInput.spoiler) file.setSpoiler(fileInput.spoiler);

  return file;
}
