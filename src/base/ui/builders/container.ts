import { ContainerBuilder, MessageFlags } from 'discord.js';

import type {
  ContainerInput,
  ContainerOptions,
  DisplayInput,
  SectionOptions,
  SectionTexts,
} from '../types';
import { splitContainerArgs } from '../utils';
import { validate } from '../validators';
import {
  attachContainerAttachments,
  collectAttachmentsFromContainerInputs,
  collectAttachmentsFromDisplayInputs,
  createRenderedComponents,
  getRenderedComponentsAttachments,
  isRenderedComponents,
  toContainerChild,
  toDisplayComponents,
} from '../normalizers';

/**
 * Creates a public section component.
 *
 * @param texts Section text blocks.
 * @param opts Section accessory options.
 * @returns Public section component.
 */
export function section(texts: SectionTexts, opts: SectionOptions = {}) {
  return { type: 'section' as const, texts, ...opts };
}

/**
 * Creates a public container builder.
 *
 * @param args Container options followed by components, or components only.
 * @returns Discord container builder.
 */
export function container(
  ...args: [ContainerOptions, ...ContainerInput[]] | ContainerInput[]
) {
  const { options, components } = splitContainerArgs(args);

  const out = new ContainerBuilder();
  out.components.push(...components.map(toContainerChild));

  if (options.color !== undefined) {
    out.setAccentColor(validate.color(options.color));
  }

  return attachContainerAttachments(
    out,
    collectAttachmentsFromContainerInputs(components),
  );
}

/**
 * Creates a rendered display component array from public display inputs.
 *
 * @param components Display inputs to render.
 * @returns Rendered display components with attachment metadata.
 */
export function render(...components: DisplayInput[]) {
  const out = toDisplayComponents(...components);
  validate.components(out);
  return createRenderedComponents(out, collectAttachmentsFromDisplayInputs(components));
}

/**
 * Sends a rendered component payload through an interaction reply.
 *
 * @param interaction Reply-capable interaction.
 * @param payload Message payload.
 * @returns Interaction reply promise.
 */
export function send(
  interaction: { reply(options: unknown): Promise<unknown> },
  payload: {
    ephemeral?: boolean;
    files?: readonly unknown[];
    components: import('../types').RenderedComponents;
  },
) {
  if (!isRenderedComponents(payload.components)) {
    throw new Error('Components must be created with ui.render(...).');
  }

  validate.components(payload.components);

  const flags = payload.ephemeral
    ? [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
    : [MessageFlags.IsComponentsV2];

  const files = [
    ...getRenderedComponentsAttachments(payload.components),
    ...(payload.files ?? []),
  ];

  return interaction.reply({
    flags,
    components: payload.components,
    ...(files.length ? { files } : {}),
  });
}
