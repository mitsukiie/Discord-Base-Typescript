import { MessageFlags } from 'discord.js';
import { createCommand } from '#builders';

// Comando simples: /ping
export default createCommand({
  name: 'ping',
  description: 'Responde com pong',

  // Função executada quando o comando é chamado
  async run(interaction) {
    await interaction.reply({
      flags: [MessageFlags.Ephemeral],
      content: '🏓 Pong!',
    });
  },
});
