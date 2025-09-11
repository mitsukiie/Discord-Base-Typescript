import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  APIApplicationCommandOption,
  APIApplicationCommandBasicOption,
  ClientEvents,
} from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// Importações internas do projeto
import { ExtendedClient, App } from '#base';
import { Command, Event, Responder, ResponderType, CommandType } from '#types';
import { logger } from '#utils';

function Creators() {
  return {
    createCommand: function <T extends CommandType>(command: Command<T>) {
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
    },

    createSubcommand: async function (name: string, directory: string): Promise<any> {
      const app = App.getInstance();
      const subcommands: Record<string, Command> = {};
      const options: APIApplicationCommandOption[] = [];

      const files = readdirSync(directory).filter((f) => f.endsWith('.ts'));
      if (app.config.terminal.showSlashCommandsFiles) {
        logger.info(`Carregando ${files.length} subcomandos do grupo "${name}"...`);
      }

      await Promise.all(
        files.map(async (file) => {
          const url = pathToFileURL(path.join(directory, file)).href;
          const module = await import(url);
          const sub = module.default;

          if (!sub?.data || !sub?.run) {
            logger.warn(`Subcomando inválido ignorado: ${file}`);
            return;
          }

          subcommands[sub.data.name] = sub;
          options.push({
            type: ApplicationCommandOptionType.Subcommand,
            name: sub.data.name,
            description: sub.data.description,
            options: sub.data.options as APIApplicationCommandBasicOption[],
          });

          if (app.config.terminal.showSlashCommandsFiles) {
            logger.success(`Subcomando carregado: ${sub.data.name}`);
          }
        }),
      );

      return {
        data: {
          name,
          description: `Comando ${name} com subcomandos`,
          type: ApplicationCommandType.ChatInput,
          options,
        },
        run: async (
          interaction: ChatInputCommandInteraction,
          client?: ExtendedClient,
        ) => {
          const name = interaction.options.getSubcommand();
          const sub = subcommands[name];
          if (!sub) {
            return interaction.reply({
              content: 'Subcomando não encontrado.',
              ephemeral: true,
            });
          }
          return sub.run(interaction, client);
        },
      };
    },

    createEvent: function <K extends keyof ClientEvents>(options: Event<K>): Event<K> {
      return options;
    },

    createResponder: function <T extends ResponderType>(opts: Responder<string, T, any>) {
      const app = App.getInstance();
      app.responders.register(opts);
      return opts;
    },
  };
}

export const { createCommand, createSubcommand, createEvent, createResponder } =
  Creators();
