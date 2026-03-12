import { MessageFlags } from 'discord.js';

import {
  getRenderedComponentsAttachments,
  isRenderedComponents,
  RenderedComponents,
} from './normalize';
import { validate } from './validate';

export type MessageReplyOptions = {
  ephemeral?: boolean;
  files?: readonly unknown[];
};

export type MessageReplyPayload = MessageReplyOptions & {
  components: RenderedComponents;
};

type ReplyableInteraction = {
  reply(options: unknown): Promise<unknown>;
};

export const message = {
  reply(interaction: ReplyableInteraction, payload: MessageReplyPayload) {
    if (!isRenderedComponents(payload.components)) {
      throw new Error('Components must be created with ui.render(...).');
    }

    validate.components(payload.components);

    const flags = payload.ephemeral
      ? [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      : [MessageFlags.IsComponentsV2];

    const autoFiles = getRenderedComponentsAttachments(payload.components);
    const files = [...autoFiles, ...(payload.files ?? [])];

    return interaction.reply({
      flags,
      components: payload.components,
      ...(files.length ? { files } : {}),
    });
  },
};
