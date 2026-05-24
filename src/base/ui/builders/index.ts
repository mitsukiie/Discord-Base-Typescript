import {
  button,
  divider,
  file,
  gallery,
  image,
  row,
  separator,
  text,
  thumbnail,
} from './primitives';
import { channel, mentionable, role, string, user } from './select';
import { container, render, section, send } from './container';

import type {
  MessageSendOptions,
  MessageSendPayload,
  ReplyableInteraction,
} from '../types';
import { toDisplayComponents } from '../normalizers';

/** Public UI factory exposing the component builders used across the bot. */
export const ui = {
  text,
  separator,
  divider,
  button,
  select: {
    user,
    string,
    role,
    channel,
    mentionable,
  },
  section,
  thumbnail,
  gallery,
  image,
  file,
  row,
  container,
  render,
  send,
} as const;

export type {
  MessageSendOptions,
  MessageSendPayload,
  ReplyableInteraction,
} from '../types';
export { toDisplayComponents } from '../normalizers';
