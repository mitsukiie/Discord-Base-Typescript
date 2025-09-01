import { SlashCommandBuilder, ApplicationCommandOptionType } from 'discord.js';
import { Command } from '#types';

/**
 * Função que transforma um objeto `Command` em um comando pronto para o Discord.js
 *
 * @param command → Objeto que segue a interface Command
 * @returns Objeto contendo:
 *   - data: SlashCommandBuilder (estrutura do comando para registrar)
 *   - run: função de execução do comando
 */

export function createCommand(command: Command) {
  // Criamos o builder base com nome e descrição obrigatórios
  const builder = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description);

  // Se o comando tiver opções, adicionamos elas ao builder
  if (command.options) {
    for (const opt of command.options) {
      switch (opt.type) {
        case ApplicationCommandOptionType.String:
          builder.addStringOption(
            (o) =>
              o
                .setName(opt.name)
                .setDescription(opt.description)
                .setRequired(opt.required ?? false), // se não vier definido, assume false
          );
          break;

        case ApplicationCommandOptionType.Integer:
          builder.addIntegerOption((o) =>
            o
              .setName(opt.name)
              .setDescription(opt.description)
              .setRequired(opt.required ?? false),
          );
          break;

        case ApplicationCommandOptionType.Boolean:
          builder.addBooleanOption((o) =>
            o
              .setName(opt.name)
              .setDescription(opt.description)
              .setRequired(opt.required ?? false),
          );
          break;

        case ApplicationCommandOptionType.User:
          builder.addUserOption((o) =>
            o
              .setName(opt.name)
              .setDescription(opt.description)
              .setRequired(opt.required ?? false),
          );
          break;

        case ApplicationCommandOptionType.Channel:
          builder.addChannelOption((o) =>
            o
              .setName(opt.name)
              .setDescription(opt.description)
              .setRequired(opt.required ?? false),
          );
          break;

        case ApplicationCommandOptionType.Role:
          builder.addRoleOption((o) =>
            o
              .setName(opt.name)
              .setDescription(opt.description)
              .setRequired(opt.required ?? false),
          );
          break;

        default:
          console.warn(`⚠️ Tipo de opção desconhecido: ${opt.type}`);
      }
    }
  }

  // Retorna o comando pronto para ser registrado
  return {
    data: builder,
    run: command.run,
  };
}
