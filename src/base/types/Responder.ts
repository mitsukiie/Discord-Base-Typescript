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

export type ResponderTypes = ResponderType | readonly ResponderType[];

type ResponderInteractionFromInput<T extends ResponderTypes> =
  T extends readonly ResponderType[]
    ? ResponderInteraction<T[number]>
    : T extends ResponderType
      ? ResponderInteraction<T>
      : never;

type SegmentParamName<Segment extends string> = Segment extends `:${infer Param}`
  ? Param
  : never;

type PathParamNames<Path extends string> = Path extends `${infer Segment}/${infer Rest}`
  ? SegmentParamName<Segment> | PathParamNames<Rest>
  : SegmentParamName<Path>;

export type ResponderParams<Path extends string> = [PathParamNames<Path>] extends [never]
  ? Record<never, never>
  : { [K in PathParamNames<Path>]: string };

export type ResponderParser<Path extends string, Output = unknown> =
  | ZodTypeAny
  | ((params: ResponderParams<Path>) => Output);

export type ResponderParse<P, Path extends string> = P extends ZodTypeAny
  ? zInfer<P>
  : P extends (params: ResponderParams<Path>) => infer R
    ? R
    : ResponderParams<Path>;

export type Responder<
  Path extends string,
  Type extends ResponderTypes,
  Parse extends ResponderParser<Path> | undefined = undefined,
> = {
  customId: Path;
  type: Type;
  parse?: Parse;
  run: RunResponder<ResponderInteractionFromInput<Type>, Path, Parse>;
  cache?: 'once' | 'temporary';
  expire?: number;
};
