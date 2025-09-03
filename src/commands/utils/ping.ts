import { MessageFlags, ApplicationCommandType } from 'discord.js';
import { createCommand } from '#base';

// Comando simples: /ping
export default createCommand({
  name: 'ping',
  description: 'Responde com pong',
  type: ApplicationCommandType.ChatInput, // Lembre de passar type para o run funcionar!

  async run(interaction) {
    await interaction.reply({
      flags: [MessageFlags.Ephemeral],
      content: '🏓 Pong! ',
    });
  },
});
