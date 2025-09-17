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
      return command;
    },

    createSubcommand: async function (name: string, directory: string): Promise<any> {
      const subcommands: Record<string, Command> = {};
      const options: APIApplicationCommandOption[] = [];

      const files = readdirSync(directory).filter((f) => f.endsWith('.ts'));
      if (settings.terminal.showSlashCommandsFiles) {
        logger.info(`Carregando ${files.length} subcomandos do grupo "${name}"...`);
      }

      await Promise.all(
        files.map(async (file) => {
          const url = pathToFileURL(path.join(directory, file)).href;
          const module = await import(url);
          const sub = module.default;

          if (!sub?.run) {
            logger.warn(`Subcomando inválido ignorado: ${file}`);
            return;
          }

          subcommands[sub.name] = sub;
          options.push({
            type: ApplicationCommandOptionType.Subcommand,
            name: sub.name,
            description: sub.description,
            options: sub.options as APIApplicationCommandBasicOption[],
          });

          if (settings.terminal.showSlashCommandsFiles) {
            logger.success(`Subcomando carregado: ${sub.name}`);
          }
        }),
      );

      return {
        name,
        description: `Comando ${name} com subcomandos`,
        type: ApplicationCommandType.ChatInput,
        options,
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
          const canRun = await CheckPermission(i, sub);
          if (!canRun) return;

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

async function CheckPermission(
  i: ChatInputCommandInteraction, 
  command: Command
) {
  const member = i.member as GuildMember;

  // 1️⃣ allowIds
  if (command.allowIds &&command.allowIds.length > 0 && !command.allowIds.includes(i.user.id)) {
    await i.reply({
      content: 'Você não tem permissão para usar este subcomando',
      flags: [MessageFlags.Ephemeral],
    });
    return false;
  }

  // 2️⃣ bot permission
  if (
    command.botpermission &&
    !i.guild?.members.me?.permissions.has(command.botpermission)
  ) {
    await i.reply({
      content: `Eu preciso da permissão **${command.botpermission}** para executar este subcomando.`,
        flags: [MessageFlags.Ephemeral],
    });
    return false;
  }

  // 3️⃣ member permission
  if (command.defaultMemberPermission && member) {
    if (!member.permissions.has(command.defaultMemberPermission)) {
      await i.reply({
        content: 'Você não tem permissão para usar este subcomando.',
        flags: [MessageFlags.Ephemeral],
      });
      return false;
    }
  }

  // 4️⃣ NSFW
  if (command.nsfw && i.channel && 'nsfw' in i.channel && !i.channel.nsfw) {
    await i.reply({
      content: 'Este subcomando só pode ser usado em canais NSFW.',
      flags: [MessageFlags.Ephemeral],
    });
    return false;
  }

  // 5️⃣ DM Permission
  if (i.guild === null && command.dmPermission === false) {
    await i.reply({
      content: 'Este comando não pode ser usado em DMs.',
      flags: [MessageFlags.Ephemeral],
    });
    return false;
  }

  return true;
}