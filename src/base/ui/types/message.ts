import type { RenderedComponents } from './render';

/** Options accepted by `ui.send(...)`. */
export type MessageSendOptions = {
  ephemeral?: boolean;
  files?: readonly unknown[];
};

/** Payload accepted by `ui.send(...)`. */
export type MessageSendPayload = MessageSendOptions & {
  components: RenderedComponents;
};

/** Minimal interaction shape used by `ui.send(...)`. */
export type ReplyableInteraction = {
  reply(options: unknown): Promise<unknown>;
};
