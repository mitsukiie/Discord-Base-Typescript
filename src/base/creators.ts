import { ApplicationCommandType, ClientEvents } from 'discord.js';
import { Command, Event } from '#types';

/**
 * Cria um comando pronto para registro
 */
export function createCommand<K extends ApplicationCommandType>(command: Command<K>) {
  const data: any = {
    name: command.name,
    description: command.description,
    type: command.type,
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

// Função auxiliar para criar eventos de forma tipada.
export function createEvent<K extends keyof ClientEvents>(options: Event<K>): Event<K> {
  return options;
}
