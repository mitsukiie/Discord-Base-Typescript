import { ButtonBuilder, ButtonStyle } from 'discord.js';

import type { Button } from '../types';
import { validateButton } from '../validators';

function isLink(button: Button): button is Extract<Button, { url: string }> {
  return 'url' in button && typeof button.url === 'string';
}

/**
 * Creates a Discord button builder from a public button descriptor.
 *
 * @param button Button descriptor.
 * @returns Discord button builder.
 */
export function normalizeButton(button: Button) {
  validateButton(button);

  const btn = new ButtonBuilder().setLabel(button.label);

  if (isLink(button)) {
    btn.setURL(button.url).setStyle(button.style ?? ButtonStyle.Link);
  } else {
    btn.setCustomId(button.customId).setStyle(button.style ?? ButtonStyle.Primary);
  }

  if (button.emoji) {
    btn.setEmoji({ name: button.emoji });
  }

  return btn;
}

/**
 * Applies button data to a button-like Discord builder.
 *
 * @param button Target button builder.
 * @param data Public button descriptor.
 * @returns The same button builder instance for chaining.
 */
export function applyButtonData<
  T extends {
    setLabel(label: string): T;
    setCustomId(id: string): T;
    setURL(url: string): T;
    setStyle(style: ButtonStyle): T;
    setEmoji(emoji: { name: string }): T;
  },
>(button: T, data: Button): T {
  button.setLabel(data.label);

  if (isLink(data)) {
    button.setURL(data.url).setStyle(data.style ?? ButtonStyle.Link);
  } else {
    button.setCustomId(data.customId).setStyle(data.style ?? ButtonStyle.Primary);
  }

  if (data.emoji) {
    button.setEmoji({ name: data.emoji });
  }

  return button;
}
