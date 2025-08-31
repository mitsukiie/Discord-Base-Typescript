import { REST, Routes } from 'discord.js';

// Importações internas do projeto
import { ExtendedClient } from '#base';
import { LoadCommands } from './Load';
import { logger } from '#utils';
import { settings } from '#settings';

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
    if (settings.terminal.showSlashCommandsRegistred) {
      logger.info(`🔄 Atualizando ${commands.length} comandos (/)...`);
    }

    // Faz upload dos comandos para a API do Discord
    if (settings.bot.guildCommands) {

      if (!settings.bot.guildID) {
        logger.error('O guildId não está definido no .env! É necessário para registrar comandos no servidor.');
        process.exit(1);
      }

      const result = (await rest.put(Routes.applicationGuildCommands(settings.bot.clientID, settings.bot.guildID),
       { body: commands }
      )) as any[];

      if (settings.terminal.showSlashCommandsRegistred) {
        logger.success(`✅ Comandos atualizados (guild - ${settings.bot.guildID}): ${result.length}`);
      }
    } else {

      const result = (await rest.put(Routes.applicationCommands(settings.bot.clientID), {
        body: commands,
      })) as any[];

      if (settings.terminal.showSlashCommandsRegistred) {
        logger.success(`✅ Comandos atualizados (global): ${result.length}`);
      }
    }
    
  } catch (err) {
    console.error('❌ Erro ao registrar comandos:', err);
  }
}
