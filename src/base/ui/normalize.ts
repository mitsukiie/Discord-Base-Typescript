import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ContainerBuilder,
  FileBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  SectionBuilder,
  SeparatorBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  TextDisplayBuilder,
} from 'discord.js';

import {
  Button,
  ContainerNode,
  ContainerChild,
  ContainerInput,
  DisplayComponent,
  FileComponent,
  MediaItem,
  RowComponent,
  SelectMenu,
  DisplayInput,
} from '@types';

import { validate } from './validate';

const ATTACHMENTS = Symbol('ui.display.attachments');
const RENDERED = Symbol('ui.display.rendered');
const RENDERED_ATTACHMENTS = Symbol('ui.display.rendered.attachments');

type ContainerWithAttachments = ContainerBuilder & {
  [ATTACHMENTS]?: readonly unknown[];
};

type RenderedComponentsMeta = DisplayComponent[] & {
  [RENDERED]?: true;
  [RENDERED_ATTACHMENTS]?: readonly unknown[];
};

export type RenderedComponents = readonly DisplayComponent[] & {
  readonly [RENDERED]: true;
};

function isContainerChild(component: unknown): component is ContainerChild {
  return (
    component instanceof TextDisplayBuilder ||
    component instanceof SeparatorBuilder ||
    component instanceof SectionBuilder ||
    component instanceof MediaGalleryBuilder ||
    component instanceof FileBuilder ||
    component instanceof ActionRowBuilder
  );
}

function isDisplayComponent(component: unknown): component is DisplayComponent {
  return component instanceof ContainerBuilder || isContainerChild(component);
}

function buildButton(button: Button) {
  validate.button(button);

  const built = new ButtonBuilder()
    .setLabel(button.label)
    .setCustomId(button.customId)
    .setStyle(button.style ?? ButtonStyle.Primary);

  if (button.emoji) {
    built.setEmoji({ name: button.emoji });
  }

  return built;
}

function applyButtonData<
  T extends {
    setLabel(label: string): T;
    setCustomId(id: string): T;
    setStyle(style: ButtonStyle): T;
    setEmoji(emoji: { name: string }): T;
  },
>(button: T, data: Button): T {
  button
    .setLabel(data.label)
    .setCustomId(data.customId)
    .setStyle(data.style ?? ButtonStyle.Primary);

  if (data.emoji) {
    button.setEmoji({ name: data.emoji });
  }

  return button;
}

function applySelectBase<
  T extends {
    setCustomId(id: string): T;
    setPlaceholder(placeholder: string): T;
    setMinValues(minValues: number): T;
    setMaxValues(maxValues: number): T;
    setDisabled(disabled?: boolean): T;
  },
>(builder: T, select: SelectMenu) {
  builder.setCustomId(select.id);

  if (select.placeholder) builder.setPlaceholder(select.placeholder);
  if (typeof select.minValues === 'number') builder.setMinValues(select.minValues);
  if (typeof select.maxValues === 'number') builder.setMaxValues(select.maxValues);
  if (typeof select.disabled === 'boolean') builder.setDisabled(select.disabled);

  return builder;
}

function buildSelect(select: SelectMenu) {
  validate.select(select);

  switch (select.type) {
    case 'select.user':
      return applySelectBase(new UserSelectMenuBuilder(), select);

    case 'select.role':
      return applySelectBase(new RoleSelectMenuBuilder(), select);

    case 'select.mentionable':
      return applySelectBase(new MentionableSelectMenuBuilder(), select);

    case 'select.channel': {
      const builder = applySelectBase(new ChannelSelectMenuBuilder(), select);
      if (select.channelTypes?.length) builder.setChannelTypes(...select.channelTypes);
      return builder;
    }

    case 'select.string': {
      const builder = applySelectBase(new StringSelectMenuBuilder(), select);

      builder.setOptions(
        ...select.options.map((option) => ({
          label: option.label,
          value: option.value,
          description: option.description,
          default: option.default,
        })),
      );

      return builder;
    }
  }
}

function buildRowComponent(component: RowComponent) {
  return 'label' in component ? buildButton(component) : buildSelect(component);
}

function buildGallery(items: readonly MediaItem[]) {
  validate.gallery(items);

  const gallery = new MediaGalleryBuilder();

  gallery.addItems(
    ...items.map((item) => (media: MediaGalleryItemBuilder) => {
      validate.url(item.url);
      media.setURL(item.url);

      if (item.description) media.setDescription(item.description);
      if (item.spoiler) media.setSpoiler(item.spoiler);

      return media;
    }),
  );

  return gallery;
}

function buildFile(fileInput: FileComponent) {
  validate.attachmentUrl(fileInput.url);

  const file = new FileBuilder().setURL(fileInput.url);
  if (fileInput.spoiler) file.setSpoiler(fileInput.spoiler);

  return file;
}

function buildEasyChild(component: ContainerNode): ContainerChild {
  switch (component.type) {
    case 'text': {
      validate.text(component.content);
      return new TextDisplayBuilder().setContent(component.content);
    }

    case 'separator': {
      return new SeparatorBuilder();
    }

    case 'section': {
      validate.section(component);

      const section = new SectionBuilder();

      section.addTextDisplayComponents(
        ...component.texts.map((content) => {
          validate.text(content);
          return (text: TextDisplayBuilder) => text.setContent(content);
        }),
      );

      if (component.button) {
        section.setButtonAccessory((button) =>
          applyButtonData(button, component.button!),
        );
      }

      if (component.thumbnail) {
        const thumbnail = component.thumbnail;
        validate.url(thumbnail.url);

        section.setThumbnailAccessory((thumb) => {
          thumb.setURL(thumbnail.url);

          if (thumbnail.description) thumb.setDescription(thumbnail.description);
          if (thumbnail.spoiler) thumb.setSpoiler(thumbnail.spoiler);

          return thumb;
        });
      }

      return section;
    }

    case 'row': {
      validate.row(component.components);

      return new ActionRowBuilder<AnyComponentBuilder>().addComponents(
        ...component.components.map(buildRowComponent),
      );
    }

    case 'gallery': {
      return buildGallery(component.items);
    }

    case 'file': {
      return buildFile(component);
    }

    default: {
      throw new Error('Unknown container component');
    }
  }
}

export function toContainerChild(component: ContainerInput): ContainerChild {
  if (isContainerChild(component)) return component;
  return buildEasyChild(component);
}

export function toDisplayComponent(component: DisplayInput): DisplayComponent {
  if (isDisplayComponent(component)) return component;
  return buildEasyChild(component);
}

export function toDisplayComponents(...components: DisplayInput[]) {
  return components.map(toDisplayComponent);
}

export function createRenderedComponents(
  components: DisplayComponent[],
  attachments: readonly unknown[],
): RenderedComponents {
  const rendered = components as RenderedComponentsMeta;

  rendered[RENDERED] = true;

  if (attachments.length > 0) {
    rendered[RENDERED_ATTACHMENTS] = attachments;
  }

  return rendered as RenderedComponents;
}

export function isRenderedComponents(value: unknown): value is RenderedComponents {
  return Array.isArray(value) && (value as RenderedComponentsMeta)[RENDERED] === true;
}

export function getRenderedComponentsAttachments(
  components: RenderedComponents,
): readonly unknown[] {
  return (components as RenderedComponentsMeta)[RENDERED_ATTACHMENTS] ?? [];
}

function isEasyFileInput(component: unknown): component is FileComponent {
  if (!component || typeof component !== 'object' || Array.isArray(component)) {
    return false;
  }

  const candidate = component as Record<string, unknown>;
  return candidate.type === 'file';
}

function getContainerAttachments(container: ContainerBuilder): readonly unknown[] {
  return (container as ContainerWithAttachments)[ATTACHMENTS] ?? [];
}

export function collectAttachmentsFromContainerInputs(
  components: readonly ContainerInput[],
): readonly unknown[] {
  return components
    .filter((component): component is FileComponent => isEasyFileInput(component))
    .map((fileInput) => fileInput.attachment)
    .filter((attachment): attachment is unknown => attachment !== undefined);
}

export function attachContainerAttachments(
  container: ContainerBuilder,
  attachments: readonly unknown[],
): ContainerBuilder {
  if (attachments.length === 0) return container;

  (container as ContainerWithAttachments)[ATTACHMENTS] = attachments;
  return container;
}

export function collectAttachmentsFromDisplayInputs(
  components: readonly DisplayInput[],
): readonly unknown[] {
  const attachments: unknown[] = [];

  for (const component of components) {
    if (component instanceof ContainerBuilder) {
      attachments.push(...getContainerAttachments(component));
      continue;
    }

    if (isEasyFileInput(component) && component.attachment !== undefined) {
      attachments.push(component.attachment);
    }
  }

  return attachments;
}
