// commands/ping.ts
import { createCommand } from '#base';
import { CommandType } from '#types';
import { MessageFlags } from 'discord.js';
import { z } from 'zod';

// comando /ping
export default createCommand({
  name: 'ping',
  description: 'Pong com botão',
  type: CommandType.ChatInput,
  async run(interaction) {
    await interaction.reply({
      content: '🏓 Pong!',
      flags: [MessageFlags.Ephemeral],
    });
  },
});
