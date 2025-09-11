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

import { RunCommand } from '#types';

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
  defaultMemberPermission?: PermissionResolvable | null;
  dmPermission?: boolean;
  integrationTypes?: ApplicationIntegrationType[] | [];
  nameLocalizations?: Partial<Record<Locale, string | null>>;
  descriptionLocalizations?: Partial<Record<Locale, string | null>>;
  nsfw?: boolean;
  cooldown?: { time: number; msg: string } | null;
  botpermission?: { permission: keyof typeof PermissionFlagsBits; msg: string } | null;
  allowIds?: { ids: string[]; msg: string } | null;
  options?: APIApplicationCommandOption[];
  run: RunCommand<Type>;
};
