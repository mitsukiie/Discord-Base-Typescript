import { REST, Routes } from 'discord.js';
import { existsSync, readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// Importações internas do projeto
import { ExtendedClient, App } from '@base';
import { createSubcommand } from '../../creators';
import { Command } from '@types';
import { logger } from '@utils';

type Serialized = ReturnType<typeof serialize>;

export async function loadCommands(client?: ExtendedClient): Promise<Serialized[]> {
  const app = App.get();
  const commands: Serialized[] = [];

  const folders = path.join(process.cwd(), 'src', 'commands');

   if (!existsSync(folders)) {
    logger.warn(`⚠️ Pasta de comandos não encontrada: ${folders}`);
    app.commands.clear();
    return commands;
  }

  const categories = readdirSync(folders);

  app.commands.clear();

  if (settings.terminal.showSlashCommandsFiles) {
    logger.info('🔄 Iniciando o carregamento de comandos...');
    logger.success(`📂 Total de categorias: ${categories.length}`);
  }

  await Promise.all(
    categories.map(async (categorie) => {
      const categoryPath = path.join(folders, categorie);
      const entries = readdirSync(categoryPath, { withFileTypes: true });

      if (settings.terminal.showSlashCommandsFiles) {
        logger.success(`📂 Categoria: ${categorie} - ${entries.length} comandos`);
      }

      await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(categoryPath, entry.name);

          // Caso seja uma pasta, tratamos como grupo de subcomandos
          if (entry.isDirectory()) {
            const command = await createSubcommand(entry.name, fullPath);
            const cmd = serialize(command);

            commands.push(cmd);
            app.commands.add(command as Command);
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

            const cmd = serialize(command);

            commands.push(cmd);
            app.commands.add(command);

            if (settings.terminal.showSlashCommandsFiles) {
              logger.success(`📄 Comando carregado: ${cmd.name}`);
            }
          } else {
            logger.warn(`⚠️ Entrada ignorada: ${entry.name}`);
          }
        }),
      );
    }),
  );

  if (client) {
    await registerCommands(client, commands)
  }

  return commands;
}

export async function registerCommands(
  client: ExtendedClient,
  commands: Serialized[]
) {
  if (!process.env.TOKEN) {
    logger.error('O token não está definido no .env!');
    process.exit(1);
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    if (settings.bot.guildID && settings.bot.guildID?.length > 0) {
      const guilds = settings.bot.guildID;

      const servers = await Promise.all(
        guilds.map(async (ID: string) => {
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

      if (settings.terminal.showSlashCommandsRegistred) {
        logger.info(JSON.stringify(servers, null, 2));
      }
    } else {
      await rest.put(Routes.applicationCommands(client.user!.id), {
        body: commands,
      });

      if (settings.terminal.showSlashCommandsRegistred) {
        logger.success(`✅ Comandos atualizados: ${commands.length}`);
      }
    }
  } catch (err) {
    console.error('❌ Erro ao registrar comandos:', err);
  }
}

export async function Commands(client: ExtendedClient) {
  const commands = await loadCommands();
  await registerCommands(client, commands);
}

function serialize(command: Command) {
  return {
    name: command.name,
    description: command.description || 'Sem descrição',
    type: command.type ?? 1,
    options: command.options || [],
    defaultMemberPermission: command.defaultMemberPermission || null,
    botpermission: command.botpermission || null,
    dmPermission: command.dmPermission !== undefined ? command.dmPermission : true,
    nsfw: command.nsfw || false,
    allowIds: command.allowIds || null,
  };
}