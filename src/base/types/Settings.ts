// Interface principal para definir as configurações do bot
export interface Settings {
  terminal: {
    mode: 'informativo' | 'minimalista';

    showSlashCommandsFiles?: boolean;
    showSlashCommandsRegistred?: boolean;

    showEventsFiles?: boolean;
    showEventsRegistred?: boolean;
  };

  bot: {
    cooldown: number;
    guildID?: string[];
  };
}
