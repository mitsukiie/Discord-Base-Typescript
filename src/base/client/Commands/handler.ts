import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// Importações internas do projeto
import { App } from '../../app';
import { ExtendedClient, logger } from '#base';
import { createSubcommand } from '../../creators';

// Função responsável por carregar os comandos do bot
export async function RegisterCommands(client: ExtendedClient) {
  const app = App.getInstance();
  const commands: any[] = [];

  // Caminho da pasta onde ficam os comandos
  const folders = path.join(process.cwd(), 'src', 'commands');
  const categories = readdirSync(folders);

  if (app.config.terminal.showSlashCommandsFiles) {
    logger.info('🔄 Iniciando o carregamento de comandos...');
    logger.success(`📂 Total de categorias: ${categories.length}`);
  }

  // Percorre cada categoria de comandos
  await Promise.all(
    categories.map(async (categorie) => {
      const categoryPath = path.join(folders, categorie);
      const entries = readdirSync(categoryPath, { withFileTypes: true });

      if (app.config.terminal.showSlashCommandsFiles) {
        logger.success(`📂 Categoria: ${categorie} - ${entries.length} comandos`);
      }

      // Percorre cada entrada dentro da categoria (pode ser pasta ou arquivo)
      await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(categoryPath, entry.name);

          // Caso seja uma pasta, tratamos como grupo de subcomandos
          if (entry.isDirectory()) {
            const command = await createSubcommand(entry.name, fullPath);

            commands.push(command.data);
            app.commands.add(entry.name, command);
          }

          // Caso seja um arquivo, tratamos como comando único
          else if (entry.isFile() && entry.name.endsWith('.ts')) {
            const url = pathToFileURL(path.resolve(fullPath)).href;
            const module = await import(url);
            const command = module.default;

            if (!command) {
              logger.warn(`⚠️ Arquivo ignorado (sem export default): ${entry.name}`);
              return;
            }

            commands.push(command.data);
            app.commands.add(command.data.name, command);

            if (app.config.terminal.showSlashCommandsFiles) {
              logger.success(`📄 Comando carregado: ${command.data.name}`);
            }
          } else {
            logger.warn(`⚠️ Entrada ignorada: ${entry.name}`);
          }
        }),
      );
    }),
  );

  if (!process.env.TOKEN) {
    logger.error('O token não está definido no .env!');
    process.exit(1);
  }

  // Cria instância do REST para atualizar os comandos no Discord
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    // Faz upload dos comandos para a API do Discord
    if (app.config.bot.guildID && app.config.bot.guildID?.length > 0) {
      const guilds = app.config.bot.guildID;

      const servers = await Promise.all(
        guilds.map(async (ID) => {
          try {
            const guild = await client.guilds.fetch(ID).catch(() => null);

            await rest.put(Routes.applicationGuildCommands(client.user!.id, ID), {
              body: commands,
            });

            return {
              ID,
              name: guild?.name ?? 'Servidor não encontrado',
              commands: commands.length,
              success: true,
            };
          } catch (error) {
            const guild = await client.guilds.fetch(ID).catch(() => null);
            return {
              ID,
              name: guild?.name ?? 'Servidor não encontrado',
              success: false,
            };
          }
        }),
      );

      if (app.config.terminal.showSlashCommandsRegistred) {
        logger.info(JSON.stringify(servers, null, 2));
      }
    } else {
      await rest.put(Routes.applicationCommands(client.user!.id), {
        body: commands,
      });

      if (app.config.terminal.showSlashCommandsRegistred) {
        logger.success(`✅ Comandos atualizados: ${commands.length}`);
      }
    }
  } catch (err) {
    console.error('❌ Erro ao registrar comandos:', err);
  }
}
