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

    guildID: [], // necessário se guildCommands for true
    guildCommands: false, // Define se os comandos serão registrados apenas no servidor (true) ou globalmente (false)
  },
};
