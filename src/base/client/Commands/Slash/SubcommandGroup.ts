import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  APIApplicationCommandOption,
} from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// Importações internas do projeto
import { ExtendedClient, logger } from '#base';
import { Command, RunS } from '#types';

// Tipo de subcomando
type Subcommand = {
  data: Command<ApplicationCommandType.ChatInput>;
  run: RunS<ApplicationCommandType.ChatInput>;
};

// Helper para adicionar opções ao subcomando
function addOption(cmd: any, opt: APIApplicationCommandOption) {
  const fnMap: Record<number, Function> = {
    [ApplicationCommandOptionType.String]: cmd.addStringOption,
    [ApplicationCommandOptionType.Integer]: cmd.addIntegerOption,
    [ApplicationCommandOptionType.Boolean]: cmd.addBooleanOption,
    [ApplicationCommandOptionType.User]: cmd.addUserOption,
    [ApplicationCommandOptionType.Channel]: cmd.addChannelOption,
    [ApplicationCommandOptionType.Role]: cmd.addRoleOption,
  };

  const addFn = fnMap[opt.type];
  if (addFn) {
    addFn.call(cmd, (o: any) =>
      o.setName(opt.name)
       .setDescription(opt.description)
       .setRequired(opt.required ?? false)
    );
  } else {
    console.warn(`Tipo de opção desconhecido: ${opt.type}`);
  }
}

// Função principal
export async function createSubcommandGroup(
  name: string,
  description: string,
  directory: string,
) {
  const builder = new SlashCommandBuilder().setName(name).setDescription(description);

  // Subcomandos armazenados em um objeto para lookup rápido
  const subcommands: Record<string, Subcommand> = {};

  // Lê arquivos .ts do diretório
  const files = readdirSync(directory).filter(f => f.endsWith('.ts'));
  if (settings.terminal.showSlashCommandsFiles) {
    logger.info(`Carregando ${files.length} subcomandos do grupo "${name}"...`);
  }

  // Importa todos os subcomandos em paralelo
  const imports = await Promise.all(files.map(async (file) => {
    const filePath = path.join(directory, file);
    const url = pathToFileURL(path.resolve(filePath)).href;

    try {
      const module: { default: Subcommand } = await import(url);
      const sub = module.default;

      if (!sub?.data || !sub?.run) {
        if (settings.terminal.showSlashCommandsFiles) {
          logger.warn(`Subcomando inválido ignorado: ${file}`);
        }
        return null;
      }

      // Adiciona ao builder
      builder.addSubcommand((cmd) => {
        cmd.setName(sub.data.name).setDescription(sub.data.description);
        sub.data.options?.forEach(opt => addOption(cmd, opt));
        if (settings.terminal.showSlashCommandsFiles) {
          logger.success(`Subcomando carregado: ${sub.data.name}`);
        }
        return cmd;
      });

      return sub;
    } catch (err) {
      if (settings.terminal.showSlashCommandsFiles) {
        logger.warn(`Erro ao importar ${file}: ${(err as Error).message}`);
      }
      return null;
    }
  }));

  // Filtra null e adiciona ao objeto de lookup
  imports.filter(Boolean).forEach(sub => {
    if (sub) subcommands[sub.data.name] = sub;
  });

  // Retorna builder + execução do grupo
  return {
    data: builder,
    async run(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
      const subName = interaction.options.getSubcommand();
      const sub = subcommands[subName];
      if (!sub) {
        return interaction.reply({
          content: 'Comando não encontrado.',
          ephemeral: true,
        });
      }
      return sub.run(interaction, client);
    },
  };
}
