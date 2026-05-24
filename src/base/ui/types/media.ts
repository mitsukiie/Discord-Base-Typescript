/** HTTP or HTTPS URL used by media components. */
export type UrlString = `http://${string}` | `https://${string}`;

/** Attachment URL used by file components. */
export type AttachmentUrlString = `attachment://${string}`;

/** Media item used by galleries and thumbnails. */
export type MediaItem = {
  url: UrlString;
  description?: string;
  spoiler?: boolean;
};

/** Public gallery descriptor used by `ui.gallery(...)`. */
export type MediaGallery = {
  type: 'gallery';
  items: readonly MediaItem[];
};

/** Public thumbnail descriptor used by section components. */
export type Thumbnail = {
  url: UrlString;
  description?: string;
  spoiler?: boolean;
};

/** Public file descriptor used by `ui.file(...)`. */
export type FileComponent = {
  type: 'file';
  url: AttachmentUrlString;
  spoiler?: boolean;
  attachment?: unknown;
};
