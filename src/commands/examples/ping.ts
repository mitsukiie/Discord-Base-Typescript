// commands/ping.ts
import { createCommand } from '#base';
import { CommandType } from '#types';
import { MessageFlags } from 'discord.js';

export default createCommand({
  name: 'ping',
  description: 'comando simples',
  type: CommandType.ChatInput,
  async run(interaction) {
    await interaction.reply({
      content: '🏓 Pong!',
      flags: [MessageFlags.Ephemeral],
    });
  },
});
