import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  UserContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
  ContextMenuCommandInteraction,
  APIApplicationCommandOption,
  ApplicationIntegrationType,
  Locale,
  PermissionResolvable,
  PermissionFlagsBits,
} from 'discord.js';

import { RunCommand, RunAutoComplete } from '#types';

export enum CommandType {
  ChatInput = ApplicationCommandType.ChatInput,
  User = ApplicationCommandType.User,
  Message = ApplicationCommandType.Message,
  PrimaryEntryPoint = ApplicationCommandType.PrimaryEntryPoint,
}

export type CommandInteraction<Type extends CommandType = CommandType> =
  Type extends CommandType.ChatInput
    ? ChatInputCommandInteraction
    : Type extends CommandType.User
      ? UserContextMenuCommandInteraction
      : Type extends CommandType.Message
        ? MessageContextMenuCommandInteraction
        : Type extends CommandType.PrimaryEntryPoint
          ? ContextMenuCommandInteraction
          : never;

export type Command<Type extends CommandType = CommandType> = {
  name: string;
  description: string;
  type: Type;
  cooldown?: number
  options?: APIApplicationCommandOption[];

  defaultMemberPermission?: PermissionResolvable | null;
  botpermission?: keyof typeof PermissionFlagsBits | null;
  dmPermission?: boolean;

  nsfw?: boolean;
  allowIds?: string[] | null;

  autocomplete?: RunAutoComplete;
  run: RunCommand<Type>;
};
