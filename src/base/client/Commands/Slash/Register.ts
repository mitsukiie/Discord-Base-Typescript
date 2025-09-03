import { REST, Routes } from 'discord.js';

// Importações internas do projeto
import { ExtendedClient, logger } from '#base';
import { LoadCommands } from './Load';;

// Função responsável por registrar os comandos do bot
export async function RegisterCommands(client: ExtendedClient) {
  const commands = await LoadCommands(client);

  if (!settings.bot.token) {
    logger.error('O token não está definido no .env!');
    process.exit(1);
  }

  // Cria instância do REST para atualizar os comandos no Discord
  const rest = new REST({ version: '10' }).setToken(settings.bot.token);

  try {
    // Faz upload dos comandos para a API do Discord
    if (settings.bot.guildID && settings.bot.guildID?.length > 0) {
      if (!settings.bot.guildID) {
        logger.error(
          'O guildId não está definido no .env! É necessário para registrar comandos no servidor.',
        );
        process.exit(1);
      }

      const guilds = settings.bot.guildID;

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
