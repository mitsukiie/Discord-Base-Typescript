import { Settings } from '#types';

/**
 * Configurações do bot
 */
export const settings: Settings = {
  terminal: {
    /**
     * Define o "estilo" dos logs no terminal
     * - "informativo": mostra todos os detalhes
     * - "minimalista": mostra apenas logs essenciais
     */

    mode: 'minimalista',

    showSlashCommandsFiles: false, // opcional
    showSlashCommandsRegistred: true, // opcional

    showEventsFiles: false, // opcional
    showEventsRegistred: true, // opcional
  },

  bot: {
    token: process.env.TOKEN!, // obrigatório, fornecido no .env
    guildID: [], // Usado para registrar os comandos apenas em um servidor
  },
};
