/** Matches HTTP and HTTPS URLs accepted by media components. */
export const HTTP_URL_PATTERN = /^https?:\/\/.+/i;

/** Matches attachment URLs accepted by file components. */
export const ATTACHMENT_URL_PATTERN = /^attachment:\/\/.+/i;

/** Matches the supported accent color formats. */
export const HEX_COLOR_PATTERN = /^(?:#|0x)?([0-9a-fA-F]{6})$/;
