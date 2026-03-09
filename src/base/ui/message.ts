import { MessageFlags } from 'discord.js';

import { DisplayInput } from '@types';

import { collectAttachmentsFromDisplayInputs, toDisplayComponents } from './normalize';
import { validate } from './validate';

export type MessageReplyOptions = {
  ephemeral?: boolean;
  files?: readonly unknown[];
};

export type MessageReplyPayload = MessageReplyOptions & {
  components: readonly DisplayInput[];
};

type ReplyableInteraction = {
  reply(options: unknown): Promise<unknown>;
};

export const message = {
  reply,
};

async function reply(
  interaction: ReplyableInteraction,
  payload: MessageReplyPayload,
): Promise<unknown> {
  return sendReply(interaction, payload);
}

function sendReply(
  interaction: ReplyableInteraction,
  payloadInput: MessageReplyPayload,
): Promise<unknown> {
  const components = toDisplayComponents(...payloadInput.components);
  validate.components(components);

  const flags = payloadInput.ephemeral
    ? [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
    : [MessageFlags.IsComponentsV2];

  const payload: {
    flags: MessageFlags[];
    components: unknown[];
    files?: readonly unknown[];
  } = {
    flags,
    components: components as unknown[],
  };

  const autoFiles = collectAttachmentsFromDisplayInputs(payloadInput.components);
  const files = [...autoFiles, ...(payloadInput.files ?? [])];

  if (files.length > 0) {
    payload.files = files;
  }

  return interaction.reply(payload);
}
