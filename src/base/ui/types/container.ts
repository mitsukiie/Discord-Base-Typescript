import type {
  ActionRowBuilder,
  AnyComponentBuilder,
  ContainerBuilder,
  FileBuilder,
  MediaGalleryBuilder,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} from 'discord.js';

import type { Button } from './button';
import type { FileComponent, MediaGallery, Thumbnail } from './media';
import type { Row } from './row';

/** Any component that can be rendered as a display component. */
export type DisplayComponent =
  | ContainerBuilder
  | TextDisplayBuilder
  | SeparatorBuilder
  | SectionBuilder
  | MediaGalleryBuilder
  | FileBuilder
  | ActionRowBuilder<AnyComponentBuilder>;

/** Display component that can appear inside a container. */
export type ContainerChild = Exclude<DisplayComponent, ContainerBuilder>;

/** Text payload used by section components. */
export type SectionTexts = [string] | [string, string] | [string, string, string];

/** Section accessory options. */
export type SectionOptions = {
  button?: Button;
  thumbnail?: Thumbnail;
};

/** Text input accepted by `ui.text(...)` and its helpers. */
export type TextInput = string | readonly string[];

/** Text formatting options used by `ui.text(...)`. */
export type TextStyleOptions = {
  size?: 1 | 2 | 3 | 4;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

/** Public text component used by `ui.text(...)`. */
export type TextComponent = { type: 'text'; content: string };

/** Public separator component used by `ui.separator(...)`. */
export type SeparatorComponent = {
  type: 'separator';
  spacing?: SeparatorSpacingSize;
  divider?: boolean;
};

/** Public section component used by `ui.section(...)`. */
export type SectionComponent = {
  type: 'section';
  texts: SectionTexts;
  button?: Button;
  thumbnail?: Thumbnail;
};

/** Public container node used by `ui.container(...)`. */
export type ContainerNode =
  | TextComponent
  | SeparatorComponent
  | SectionComponent
  | Row
  | MediaGallery
  | FileComponent;

/** Allowed container input passed to `ui.container(...)`. */
export type ContainerInput = ContainerChild | ContainerNode | Button;

/** Optional container configuration. */
export type ContainerOptions = {
  color?: number | string;
};

/** Any component accepted by `ui.render(...)`. */
export type DisplayInput = DisplayComponent | ContainerNode | Button;
