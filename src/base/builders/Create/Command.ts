import { ApplicationCommandType } from 'discord.js';
import { Command } from '#types';

const type = {
  ChatInput: ApplicationCommandType.ChatInput,
  User: ApplicationCommandType.User,
  Message: ApplicationCommandType.Message,
};

/**
 * Cria um comando pronto para registro
 * Retorna um objeto com `data` contendo tudo que o Discord precisa e `run`.
 */
export function createCommand(command: Command) {
  // Monta o objeto "data" diretamente
  const data: any = {
    name: command.name,
    description: command.description,
    type: type[command.type as keyof typeof type],
    default_member_permissions: command.defaultMemberPermission ?? undefined,
    dm_permission: command.dmPermission ?? true,
    nsfw: command.nsfw ?? false,
    options: command.options ?? [],
    name_localizations: command.nameLocalizations ?? {},
    description_localizations: command.descriptionLocalizations ?? {},

    ...(command.integrationTypes && command.integrationTypes.length > 0
      ? { integration_types: command.integrationTypes }
      : {}),
  };

  return {
    data,
    run: command.run,
  };
}
