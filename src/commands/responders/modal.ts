import { createCommand, createResponder } from '#base';
import { ResponderType, CommandType } from '#types';
import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  MessageFlags,
} from 'discord.js';
import { z } from 'zod';

createResponder({
  customId: 'responder/:name',
  parse: z.object({ name: z.string().min(2).max(20) }).parse,
  types: ResponderType.Modal,
  async run(interaction, { name }) {
    const text = interaction.fields.getTextInputValue('input');
    await interaction.reply({
      content: `@${name} seu texto: \n> ${text}`,
      flags: [MessageFlags.Ephemeral],
    });
  },
});

export default createCommand({
  name: 'modal',
  description: 'Comando com Responder Modal',
  type: CommandType.ChatInput,
  async run(interaction) {
    const user = interaction.user;

    const modal = new ModalBuilder()
      .setCustomId(`responder/${user.username}`) // customId com parâmetro dinâmico
      .setTitle('Exemplo de Modal');

    const input = new TextInputBuilder()
      .setCustomId('input')
      .setLabel('Digite algo')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Digite aqui...')
      .setRequired(true)
      .setMinLength(2)
      .setMaxLength(50);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
    modal.addComponents(row);

    interaction.showModal(modal);
  },
});
