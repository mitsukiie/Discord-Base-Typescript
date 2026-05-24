import { ChannelType } from 'discord.js';

import type { ButtonID } from './button';

/** Shared base fields for all select menus. */
export type SelectBase = {
  id: ButtonID;
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  disabled?: boolean;
};

/** Single string-select option descriptor. */
export type StringSelectOption = {
  label: string;
  value: string;
  description?: string;
  default?: boolean;
};

/** Public string-select descriptor used by `ui.select.string(...)`. */
export type StringSelect = SelectBase & {
  type: 'select.string';
  options: readonly StringSelectOption[];
};

/** Public user-select descriptor used by `ui.select.user(...)`. */
export type UserSelect = SelectBase & {
  type: 'select.user';
};

/** Public role-select descriptor used by `ui.select.role(...)`. */
export type RoleSelect = SelectBase & {
  type: 'select.role';
};

/** Public mentionable-select descriptor used by `ui.select.mentionable(...)`. */
export type MentionableSelect = SelectBase & {
  type: 'select.mentionable';
};

/** Public channel-select descriptor used by `ui.select.channel(...)`. */
export type ChannelSelect = SelectBase & {
  type: 'select.channel';
  channelTypes?: readonly ChannelType[];
};

/** Union of all supported select menu descriptors. */
export type SelectMenu =
  | StringSelect
  | UserSelect
  | RoleSelect
  | MentionableSelect
  | ChannelSelect;
