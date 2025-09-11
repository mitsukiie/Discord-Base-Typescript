import { createCommand, createResponder } from '#base';
import { ResponderType, CommandType } from '#types';
import { StringSelectMenuBuilder, ActionRowBuilder, MessageFlags } from 'discord.js';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(2).max(20) });

createResponder({
  customId: 'responder/:name',
  types: ResponderType.SelectString,
  parse: schema.parse,
  async run(interaction, { name }) {
    const values = interaction.values.join(', ');

    await interaction.reply({
      content: `@${name} você selecionou: \n> ${values}`,
      flags: [MessageFlags.Ephemeral],
    });
  },
});

export default createCommand({
  name: 'select',
  description: 'Comando com Responder Select Menu',
  type: CommandType.ChatInput,
  async run(interaction) {
    const user = interaction.user;

    const select = new StringSelectMenuBuilder()
      .setCustomId(`responder/${user.username}`)
      .setPlaceholder('Selecione uma opção')
      .setMinValues(1)
      .setMaxValues(3)
      .addOptions([
        {
          label: 'Opção 1',
          description: 'Descrição da Opção 1',
          value: 'option_1',
        },
        {
          label: 'Opção 2',
          description: 'Descrição da Opção 2',
          value: 'option_2',
        },
        {
          label: 'Opção 3',
          description: 'Descrição da Opção 3',
          value: 'option_3',
        },
      ]);

    await interaction.reply({
      content: 'Selecione uma ou mais opções no menu abaixo:',
      flags: [MessageFlags.Ephemeral],
      components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)],
    });
  },
});
