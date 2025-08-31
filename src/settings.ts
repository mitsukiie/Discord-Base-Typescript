import { Settings } from '#types';

/**
 * Configurações do bot
 */
export const settings: Settings = {
  terminal: {
    // Modo dos logs: "minimalista" ou "informativo"
    mode: 'minimalista',

    showSlashCommandsFiles: false, // opcional
    showSlashCommandsRegistred: true, // opcional

    showEventsFiles: false, // opcional
    showEventsRegistred: true, // opcional
  },

  bot: {
    token: process.env.TOKEN!, // obrigatório, fornecido no .env
    clientID: process.env.CLIENT_ID!, // obrigatório, fornecido no .env

    guildID: 'your_guild_id', // necessário se guildCommands for true, fornecido no .env
    guildCommands: false, // Define se os comandos serão registrados apenas no servidor (true) ou globalmente (false)
  },
};
