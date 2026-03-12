import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ButtonStyle,
  ChannelType,
  ContainerBuilder,
  FileBuilder,
  MediaGalleryBuilder,
  SectionBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
} from 'discord.js';

export type UrlString = `http://${string}` | `https://${string}`;
export type AttachmentUrlString = `attachment://${string}`;
export type ButtonID = string & {};

export type DisplayComponent =
  | ContainerBuilder
  | TextDisplayBuilder
  | SeparatorBuilder
  | SectionBuilder
  | MediaGalleryBuilder
  | FileBuilder
  | ActionRowBuilder<AnyComponentBuilder>;

export type ContainerChild = Exclude<DisplayComponent, ContainerBuilder>;

export type Button = {
  label: string;
  customId: ButtonID;
  emoji?: string;
  style?: ButtonStyle;
};

export type SelectBase = {
  id: ButtonID;
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  disabled?: boolean;
};

export type StringSelectOption = {
  label: string;
  value: string;
  description?: string;
  default?: boolean;
};

export type StringSelect = SelectBase & {
  type: 'select.string';
  options: readonly StringSelectOption[];
};

export type UserSelect = SelectBase & {
  type: 'select.user';
};

export type RoleSelect = SelectBase & {
  type: 'select.role';
};

export type MentionableSelect = SelectBase & {
  type: 'select.mentionable';
};

export type ChannelSelect = SelectBase & {
  type: 'select.channel';
  channelTypes?: readonly ChannelType[];
};

export type SelectMenu =
  | StringSelect
  | UserSelect
  | RoleSelect
  | MentionableSelect
  | ChannelSelect;

export type RowComponent = Button | SelectMenu;

export type TextComponent = { type: 'text'; content: string };

export type SeparatorComponent = { type: 'separator' };

export type FileComponent = {
  type: 'file';
  url: AttachmentUrlString;
  spoiler?: boolean;
  attachment?: unknown;
};

export type MediaItem = {
  url: UrlString;
  description?: string;
  spoiler?: boolean;
};

export type MediaGallery = {
  type: 'gallery';
  items: readonly MediaItem[];
};

export type Thumbnail = {
  url: UrlString;
  description?: string;
  spoiler?: boolean;
};

export type SectionTexts = [string] | [string, string] | [string, string, string];

export type SectionOptions = {
  button?: Button;
  thumbnail?: Thumbnail;
};

export type SectionComponent = {
  type: 'section';
  texts: SectionTexts;
  button?: Button;
  thumbnail?: Thumbnail;
};

export type Row = {
  type: 'row';
  components: readonly RowComponent[];
};

export type ContainerNode =
  | TextComponent
  | SeparatorComponent
  | SectionComponent
  | Row
  | MediaGallery
  | FileComponent;

export type ContainerInput = ContainerChild | ContainerNode;

export type ContainerOptions = {
  color?: number | string;
};

export type DisplayInput = DisplayComponent | ContainerNode;
