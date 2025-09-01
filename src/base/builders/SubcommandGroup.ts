import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// Importações internas do projeto
import { ExtendedClient } from '#base';
import { logger } from '#utils';
import { settings } from '#settings';

// Função para criar um grupo de subcomandos
export async function createSubcommandGroup(
  name: string,
  description: string,
  directory: string,
) {
  const builder = new SlashCommandBuilder().setName(name).setDescription(description);

  // Array que vai armazenar os subcomandos carregado
  const subcommands: {
    name: string;
    run: (
      interaction: ChatInputCommandInteraction,
      client: ExtendedClient,
    ) => Promise<void>;
  }[] = [];

  const files = readdirSync(directory).filter((f) => f.endsWith('.ts'));

  if (settings.terminal.showSlashCommandsFiles) {
    logger.info(`Carregando ${files.length} subcomandos do grupo "${name}"...`);
  }
  // Iteramos pelos arquivos para importar cada subcomando
  for (const file of files) {
    const filePath = path.join(directory, file);
    const url = pathToFileURL(path.resolve(filePath)).href;
    const module = await import(url);
    const subcommand = module.default;

    if (!subcommand?.data || !subcommand?.run) {
      if (settings.terminal.showSlashCommandsFiles)
        logger.warn(`Subcomando inválido ignorado: ${file}`);
      continue;
    }

    // Adiciona o subcomando ao builder principal
    builder.addSubcommand((cmd) => {
      cmd.setName(subcommand.data.name).setDescription(subcommand.data.description);

      // Se o subcomando tiver opções, adiciona cada uma (pode ser adicionado mais tipos conforme necessário)
      if (subcommand.data.options) {
        for (const opt of subcommand.data.options) {
          switch (opt.type) {
            case ApplicationCommandOptionType.String:
              cmd.addStringOption(
                (o) =>
                  o
                    .setName(opt.name)
                    .setDescription(opt.description)
                    .setRequired(opt.required ?? false), // Opcional por padrão
              );
              break;
            case ApplicationCommandOptionType.Integer:
              cmd.addIntegerOption((o) =>
                o
                  .setName(opt.name)
                  .setDescription(opt.description)
                  .setRequired(opt.required ?? false),
              );
              break;
            case ApplicationCommandOptionType.Boolean:
              cmd.addBooleanOption((o) =>
                o
                  .setName(opt.name)
                  .setDescription(opt.description)
                  .setRequired(opt.required ?? false),
              );
              break;
            case ApplicationCommandOptionType.User:
              cmd.addUserOption((o) =>
                o
                  .setName(opt.name)
                  .setDescription(opt.description)
                  .setRequired(opt.required ?? false),
              );
              break;
            case ApplicationCommandOptionType.Channel:
              cmd.addChannelOption((o) =>
                o
                  .setName(opt.name)
                  .setDescription(opt.description)
                  .setRequired(opt.required ?? false),
              );
              break;
            case ApplicationCommandOptionType.Role:
              cmd.addRoleOption((o) =>
                o
                  .setName(opt.name)
                  .setDescription(opt.description)
                  .setRequired(opt.required ?? false),
              );
              break;
            default:
              console.warn(`Tipo de opção desconhecido: ${opt.type}`);
          }
        }
      }

      if (settings.terminal.showSlashCommandsFiles) {
        logger.success(`Subcomando carregado: ${subcommand.data.name}`);
      }

      return cmd;
    });

    // Armazena o subcomando no array para execução posterior
    subcommands.push({
      name: subcommand.data.name,
      run: subcommand.run,
    });
  }

  // Retorna o objeto final com o builder e a função de execução
  return {
    data: builder,
    async run(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
      // Obtém o nome do subcomando usado na interação
      const subName = interaction.options.getSubcommand();

      // Procura o subcomando correspondente
      const sub = subcommands.find((s) => s.name === subName);
      if (!sub) {
        return interaction.reply({
          content: 'Comando não encontrado.',
          ephemeral: true,
        });
      }

      // Executa a função do subcomando
      return sub.run(interaction, client);
    },
  };
}
// mudança na 1.0.3
