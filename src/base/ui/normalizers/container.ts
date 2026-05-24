import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ContainerBuilder,
  FileBuilder,
  MediaGalleryBuilder,
  SeparatorBuilder,
  SectionBuilder,
  TextDisplayBuilder,
} from 'discord.js';

import type {
  ContainerChild,
  ContainerInput,
  DisplayComponent,
  DisplayInput,
  FileComponent,
  ContainerNode,
  Button,
  Row,
  RowComponent,
  SectionComponent,
  SeparatorComponent,
  TextComponent,
} from '../types';
import { ATTACHMENTS, RENDERED, RENDERED_ATTACHMENTS } from '../constants';
import {
  validateComponents,
  validateRow,
  validateSection,
  validateText,
  validateUrl,
} from '../validators';
import { applyButtonData, normalizeButton } from './button';
import { normalizeFile, normalizeGallery } from './media';
import { normalizeSelect } from './select';

type ContainerWithAttachments = ContainerBuilder & {
  [ATTACHMENTS]?: readonly unknown[];
};

type RenderedComponentsMeta = DisplayComponent[] & {
  [RENDERED]?: true;
  [RENDERED_ATTACHMENTS]?: readonly unknown[];
};

function isChild(component: unknown): component is ContainerChild {
  return (
    component instanceof TextDisplayBuilder ||
    component instanceof SeparatorBuilder ||
    component instanceof SectionBuilder ||
    component instanceof MediaGalleryBuilder ||
    component instanceof FileBuilder ||
    component instanceof ActionRowBuilder
  );
}

function isDisplay(component: unknown): component is DisplayComponent {
  return component instanceof ContainerBuilder || isChild(component);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isButton(component: unknown): component is Button {
  if (!isObject(component)) {
    return false;
  }

  const candidate = component;
  return (
    typeof candidate.label === 'string' && ('customId' in candidate || 'url' in candidate)
  );
}

function toRow(component: Button) {
  return new ActionRowBuilder<AnyComponentBuilder>().addComponents(
    normalizeButton(component),
  );
}

function normalizeRowComponent(component: RowComponent) {
  return 'label' in component ? normalizeButton(component) : normalizeSelect(component);
}

function normalizeText(component: TextComponent) {
  validateText(component.content);
  return new TextDisplayBuilder().setContent(component.content);
}

function normalizeSeparator(component: SeparatorComponent) {
  const separator = new SeparatorBuilder();

  if (typeof component.spacing !== 'undefined') {
    separator.setSpacing(component.spacing);
  }

  if (typeof component.divider !== 'undefined') {
    separator.setDivider(component.divider);
  }

  return separator;
}

function setSectionButton(section: SectionBuilder, button: Button) {
  section.setButtonAccessory((target) => applyButtonData(target, button));
}

function setSectionThumb(
  section: SectionBuilder,
  thumbnail: NonNullable<SectionComponent['thumbnail']>,
) {
  validateUrl(thumbnail.url);

  section.setThumbnailAccessory((target) => {
    target.setURL(thumbnail.url);

    if (thumbnail.description) target.setDescription(thumbnail.description);
    if (thumbnail.spoiler) target.setSpoiler(thumbnail.spoiler);

    return target;
  });
}

function normalizeSection(component: SectionComponent) {
  validateSection(component);

  const section = new SectionBuilder();

  section.addTextDisplayComponents(
    ...component.texts.map((content) => {
      validateText(content);
      return (text: TextDisplayBuilder) => text.setContent(content);
    }),
  );

  if (component.button) {
    setSectionButton(section, component.button);
  }

  if (component.thumbnail) {
    setSectionThumb(section, component.thumbnail);
  }

  return section;
}

function normalizeRow(component: Row) {
  validateRow(component.components);

  return new ActionRowBuilder<AnyComponentBuilder>().addComponents(
    ...component.components.map(normalizeRowComponent),
  );
}

function normalizeNode(component: ContainerNode): ContainerChild {
  switch (component.type) {
    case 'text':
      return normalizeText(component);

    case 'separator':
      return normalizeSeparator(component);

    case 'section':
      return normalizeSection(component);

    case 'row':
      return normalizeRow(component);

    case 'gallery':
      return normalizeGallery(component.items);

    case 'file':
      return normalizeFile(component);

    default:
      throw new Error('Unknown container component');
  }
}

/**
 * Converts a container input into a container child builder when needed.
 *
 * @param component Container input.
 * @returns Discord container child.
 */
export function toContainerChild(component: ContainerInput): ContainerChild {
  if (isChild(component)) return component;
  if (isButton(component)) return toRow(component);
  return normalizeNode(component);
}

/**
 * Converts a display input into a Discord display component.
 *
 * @param component Display input.
 * @returns Discord display component.
 */
export function toDisplayComponent(component: DisplayInput): DisplayComponent {
  if (isDisplay(component)) return component;
  if (isButton(component)) return toRow(component);
  return normalizeNode(component);
}

/**
 * Converts a variadic list of display inputs into Discord display components.
 *
 * @param components Display inputs.
 * @returns Discord display components.
 */
export function toDisplayComponents(...components: DisplayInput[]) {
  return components.map(toDisplayComponent);
}

/**
 * Marks a display component array as rendered and stores attachment metadata.
 *
 * @param components Rendered display components.
 * @param attachments Attachment metadata.
 * @returns Rendered components with metadata.
 */
export function createRenderedComponents(
  components: DisplayComponent[],
  attachments: readonly unknown[],
) {
  const rendered = components as RenderedComponentsMeta;

  rendered[RENDERED] = true;

  if (attachments.length > 0) {
    rendered[RENDERED_ATTACHMENTS] = attachments;
  }

  return rendered as import('../types').RenderedComponents;
}

/**
 * Checks whether a value is a rendered component array.
 *
 * @param value Value to inspect.
 * @returns Whether the value was created by `createRenderedComponents(...)`.
 */
export function isRenderedComponents(
  value: unknown,
): value is import('../types').RenderedComponents {
  return Array.isArray(value) && (value as RenderedComponentsMeta)[RENDERED] === true;
}

/**
 * Gets the attachment metadata attached to a rendered component array.
 *
 * @param components Rendered components.
 * @returns Rendered attachments.
 */
export function getRenderedComponentsAttachments(
  components: import('../types').RenderedComponents,
): readonly unknown[] {
  return (components as RenderedComponentsMeta)[RENDERED_ATTACHMENTS] ?? [];
}

function isEasyFileInput(component: unknown): component is FileComponent {
  if (!isObject(component)) {
    return false;
  }

  const candidate = component;
  return candidate.type === 'file';
}

function getContainerAttachments(container: ContainerBuilder): readonly unknown[] {
  return (container as ContainerWithAttachments)[ATTACHMENTS] ?? [];
}

/**
 * Collects file attachments from public container inputs.
 *
 * @param components Container inputs.
 * @returns Collected attachment payloads.
 */
export function collectAttachmentsFromContainerInputs(
  components: readonly ContainerInput[],
): readonly unknown[] {
  return components
    .filter((component): component is FileComponent => isEasyFileInput(component))
    .map((fileInput) => fileInput.attachment)
    .filter((attachment): attachment is unknown => attachment !== undefined);
}

/**
 * Attaches metadata to a container builder for later file collection.
 *
 * @param container Container builder.
 * @param attachments Attachments to associate with the container.
 * @returns The same container builder instance for chaining.
 */
export function attachContainerAttachments(
  container: ContainerBuilder,
  attachments: readonly unknown[],
): ContainerBuilder {
  if (attachments.length === 0) return container;

  (container as ContainerWithAttachments)[ATTACHMENTS] = attachments;
  return container;
}

/**
 * Collects file attachments from rendered display inputs.
 *
 * @param components Display inputs.
 * @returns Collected attachment payloads.
 */
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
