import {
  APIApplicationCommandOption,
  ApplicationCommandType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  Locale,
  MessageContextMenuCommandInteraction,
  type PermissionFlagsBits,
  PermissionResolvable,
  UserContextMenuCommandInteraction,
} from 'discord.js';

import { RunS } from '#types';

/**
 * Mapeamento de cada tipo de comando para a interação correspondente.
 *
 * Permite tipar corretamente a função `run` de acordo com o tipo de comando.
 */
export type Interactions = {
  [ApplicationCommandType.ChatInput]: ChatInputCommandInteraction;
  [ApplicationCommandType.User]: UserContextMenuCommandInteraction;
  [ApplicationCommandType.Message]: MessageContextMenuCommandInteraction;
  [ApplicationCommandType.PrimaryEntryPoint]: ContextMenuCommandInteraction;
};

/**
 * Estrutura base de um comando do bot.
 *
 * Cada arquivo de comando deve exportar um objeto que siga este contrato.
 * Garante tipagem forte para:
 * - Nome e descrição do comando
 * - Tipo de comando (ChatInput, User ou Message)
 * - Permissões padrão e DM
 * - Localizações (nome e descrição)
 * - Opções de comando
 * - Cooldowns, permissões de bot e restrições de usuários
 * - Função `run` com tipagem correta da interação
 */
export type Command<
  K extends keyof typeof ApplicationCommandType = keyof typeof ApplicationCommandType,
> = {
  [P in K]: {
    name: string;
    description: string;
    type: P;
    defaultMemberPermission?: PermissionResolvable | null;
    dmPermission?: boolean;
    integrationTypes?: ApplicationIntegrationType[] | [];
    nameLocalizations?: Partial<Record<Locale, string | null>>;
    descriptionLocalizations?: Partial<Record<Locale, string | null>>;
    nsfw?: boolean;
    cooldown?: {
      time: number;
      msg: string;
    } | null;
    botpermission?: {
      permission: keyof typeof PermissionFlagsBits;
      msg: string;
    } | null;
    allowIds?: {
      ids: string[];
      msg: string;
    } | null;
    options?: APIApplicationCommandOption[];
    run: RunS<(typeof ApplicationCommandType)[P]>;
  };
}[K];
