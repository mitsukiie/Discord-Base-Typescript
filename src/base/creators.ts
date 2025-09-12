import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  APIApplicationCommandOption,
  APIApplicationCommandBasicOption,
  ClientEvents,
  AutocompleteInteraction,
  GuildMember,
  MessageFlags,
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
        options: command.options ?? [],
        defaultmemberpermissions: command.defaultMemberPermission ?? undefined,
        dmpermission: command.dmPermission ?? true,
        botpermission: command.botpermission ?? null,
        allowids: command.allowIds ?? [],
        nsfw: command.nsfw ?? false,
      };

      return {
        data,
        autocomplete: command.autocomplete,
        run: command.run,
      };
    },

    createSubcommand: async function (name: string, directory: string): Promise<any> {
      const app = App.getInstance();
      const subcommands: Record<string, any> = {};
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
        autocomplete: (i: AutocompleteInteraction, focused: string) => {
          const name = i.options.getSubcommand();
          const sub = subcommands[name];
          return sub?.autocomplete?.(i, focused);
        },
        run: async (i: ChatInputCommandInteraction, client?: ExtendedClient) => {
          const name = i.options.getSubcommand();
          const sub = subcommands[name];
          if (!sub) {
            return i.reply({
              content: 'Subcomando não encontrado.',
              ephemeral: true,
            });
          }

          if (sub.data.allowids.length > 0 && !sub.data.allowids.includes(i.user.id)) {
            return i.reply({
              content: 'Você não tem permissão para usar este subcomando',
              flags: [MessageFlags.Ephemeral],
            });
          }

          if (
            sub.data.botpermission &&
            !i.guild?.members.me?.permissions.has(sub.data.botpermission)
          ) {
            return i.reply({
              content: `Eu preciso da permissão **${sub.data.botpermission}** para executar este subcomando.`,
              flags: [MessageFlags.Ephemeral],
            });
          }

          if (sub.data.defaultmemberpermissions) {
            const member = i.member as GuildMember;

            if (!member.permissions.has(sub.data.defaultmemberpermissions)) {
              return i.reply({
                content: 'Você não tem permissão para usar este subcomando.',
                flags: [MessageFlags.Ephemeral],
              });
            }
          }

          if (sub.data.nsfw && i.channel && 'nsfw' in i.channel && !i.channel.nsfw) {
            return i.reply({
              content: 'Este subcomando só pode ser usado em canais NSFW.',
              flags: [MessageFlags.Ephemeral],
            });
          }

          if (i.guild === null && sub.data.dmpermission === false) {
            return i.reply({
              content: 'Este subcomando não pode ser usado em mensagens diretas.',
              flags: [MessageFlags.Ephemeral],
            });
          }

          return sub.run(i, client);
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
