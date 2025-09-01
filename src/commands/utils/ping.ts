import { MessageFlags } from 'discord.js';
import { createCommand } from '#builders';

// Comando simples: /ping
export default createCommand({
  name: 'ping',
  description: 'Responde com pong',
  type: 'ChatInput', // Lembre de passar type para o run funcionar!

  async run(interaction) {
    await interaction.reply({
      flags: [MessageFlags.Ephemeral],
      content: '🏓 Pong! ',
    });
  },
});
