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

export type EasyButton = {
  label: string;
  id: ButtonID;
  style?: ButtonStyle;
};

export type EasySelectBase = {
  id: ButtonID;
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  disabled?: boolean;
};

export type EasyStringSelectOption = {
  label: string;
  value: string;
  description?: string;
  default?: boolean;
};

export type EasyStringSelect = EasySelectBase & {
  type: 'select.string';
  options: readonly EasyStringSelectOption[];
};

export type EasyUserSelect = EasySelectBase & {
  type: 'select.user';
};

export type EasyRoleSelect = EasySelectBase & {
  type: 'select.role';
};

export type EasyMentionableSelect = EasySelectBase & {
  type: 'select.mentionable';
};

export type EasyChannelSelect = EasySelectBase & {
  type: 'select.channel';
  channelTypes?: readonly ChannelType[];
};

export type EasySelectMenu =
  | EasyStringSelect
  | EasyUserSelect
  | EasyRoleSelect
  | EasyMentionableSelect
  | EasyChannelSelect;

export type EasyRowComponent = EasyButton | EasySelectMenu;

export type EasyText = string | { type: 'text'; content: string };

export type EasySeparator = { type: 'separator' };

export type EasyFile = {
  type: 'file';
  url: AttachmentUrlString;
  spoiler?: boolean;
  attachment?: unknown;
};

export type EasyMediaItem = {
  url: UrlString;
  description?: string;
  spoiler?: boolean;
};

export type EasyMediaGallery = {
  type: 'gallery';
  items: readonly EasyMediaItem[];
};

export type EasyThumbnail = {
  url: UrlString;
  description?: string;
  spoiler?: boolean;
};

export type SectionTexts = [string] | [string, string] | [string, string, string];

export type SectionOptions = {
  button?: EasyButton;
  thumbnail?: EasyThumbnail;
};

export type EasySection = {
  type: 'section';
  texts: SectionTexts;
  button?: EasyButton;
  thumbnail?: EasyThumbnail;
};

export type EasyRow = {
  type: 'row';
  components: readonly EasyRowComponent[];
};

export type EasyContainerChild =
  | EasyText
  | EasySeparator
  | EasySection
  | EasyRow
  | EasyMediaGallery
  | EasyFile;

export type ContainerInput = ContainerChild | EasyContainerChild;

export type ContainerOptions = {
  color?: number | string;
  text?: string;
  description?: string;
};

export type DisplayInput = DisplayComponent | EasyContainerChild;
