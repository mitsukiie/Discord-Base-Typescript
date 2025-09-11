import {
  Interaction,
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
  RoleSelectMenuInteraction,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  CacheType,
} from 'discord.js';

import { RunResponder } from '#types';

export enum ResponderType {
  Button = 'button',
  Modal = 'modal',
  SelectString = 'select.string',
  SelectUser = 'select.user',
  SelectRole = 'select.role',
  SelectChannel = 'select.channel',
  SelectMentionable = 'select.mentionable',
}

export type ResponderInteraction<Type extends ResponderType = ResponderType> =
  Type extends ResponderType.Button
    ? ButtonInteraction
    : Type extends ResponderType.Modal
      ? ModalSubmitInteraction
      : Type extends ResponderType.SelectString
        ? StringSelectMenuInteraction
        : Type extends ResponderType.SelectUser
          ? UserSelectMenuInteraction
          : Type extends ResponderType.SelectRole
            ? RoleSelectMenuInteraction
            : Type extends ResponderType.SelectChannel
              ? ChannelSelectMenuInteraction
              : Type extends ResponderType.SelectMentionable
                ? MentionableSelectMenuInteraction
                : never;

export type Params<Route extends string> =
  Route extends `${string}/:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof Params<Rest>]: any }
    : Route extends `${string}/:${infer Param}`
      ? { [K in Param]: any }
      : Route extends `:${infer Param}/${infer Rest}`
        ? { [K in Param | keyof Params<Rest>]: any }
        : Route extends `:${infer Param}`
          ? { [K in Param]: any }
          : any;

export type Responder<
  Path extends string,
  Type extends ResponderType = ResponderType,
  Parsed = Params<Path>,
> = {
  customId: Path;
  types: Type;
  parse?: (params: Params<Path>) => Parsed;
  run: RunResponder<Type, Parsed>;
  cache?: 'once' | 'temporary';
  expire?: number;
};
