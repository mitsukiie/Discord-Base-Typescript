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

import { RunS } from '#types';

/**
 * Mapeamento de cada tipo de comando para a interação correspondente.
 */
export type Interactions = {
  [ApplicationCommandType.ChatInput]: ChatInputCommandInteraction;
  [ApplicationCommandType.User]: UserContextMenuCommandInteraction;
  [ApplicationCommandType.Message]: MessageContextMenuCommandInteraction;
  [ApplicationCommandType.PrimaryEntryPoint]: ContextMenuCommandInteraction;
};

/**
 * Estrutura base de um comando do bot usando enums.
 */
export type Command<K extends ApplicationCommandType = ApplicationCommandType> = {
  name: string;
  description: string;
  type: K;
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
  run: RunS<K>;
};
