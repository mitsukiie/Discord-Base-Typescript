import {
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
  RoleSelectMenuInteraction,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
} from 'discord.js';

import { ZodTypeAny, infer as zInfer } from 'zod/v3';

import { RunResponder } from '@types';

export enum ResponderType {
  Button = 'button',
  Modal = 'modal',
  SelectString = 'select.string',
  SelectUser = 'select.user',
  SelectRole = 'select.role',
  SelectChannel = 'select.channel',
  SelectMentionable = 'select.mentionable',
}

type Map = {
  [ResponderType.Button]: ButtonInteraction;
  [ResponderType.Modal]: ModalSubmitInteraction;
  [ResponderType.SelectString]: StringSelectMenuInteraction;
  [ResponderType.SelectUser]: UserSelectMenuInteraction;
  [ResponderType.SelectRole]: RoleSelectMenuInteraction;
  [ResponderType.SelectChannel]: ChannelSelectMenuInteraction;
  [ResponderType.SelectMentionable]: MentionableSelectMenuInteraction;
};
export type ResponderInteraction<T extends ResponderType> = Map[T];

type Params<Path extends string> =
  Path extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof Params<Rest>]: string }
    : Path extends `${infer _Start}:${infer Param}`
      ? { [K in Param]: string }
      : {};

export type ResponderParse<P, Path extends string> = P extends ZodTypeAny
  ? zInfer<P>
  : P extends (params: Params<Path>) => infer R
    ? R
    : Params<Path>;

export type Responder<Path extends string, Type extends ResponderType, P = undefined> = {
  customId: Path;
  type: Type;
  parse?: ZodTypeAny | ((params: Params<Path>) => any);
  run: RunResponder<Type, Path, P>;
  cache?: 'once' | 'temporary';
  expire?: number;
};
