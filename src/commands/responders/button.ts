import { createCommand, createResponder } from '@base';
import { ResponderType, CommandType } from '@types';
import { ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } from 'discord.js';

createResponder({
  customId: 'responder/:id',
  type: ResponderType.Button,
  async run(interaction, { id }) {
    await interaction.reply({
      content: `Olá seu id é ${id}`,
      flags: [MessageFlags.Ephemeral],
    });
  },
});

export default createCommand({
  name: 'button',
  description: 'Comando com Responder Button',
  type: CommandType.ChatInput,
  async run(interaction) {
    const user = interaction.user;

    const id = new ButtonBuilder()
      .setCustomId(`responder/${user.id}`)
      .setLabel('Veja seu ID')
      .setStyle(ButtonStyle.Primary);

    await interaction.reply({
      content: 'Clique no botão abaixo:',
      flags: [MessageFlags.Ephemeral],
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(id)],
    });
  },
});
