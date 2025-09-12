// commands/ping.ts
import { createCommand } from '#base';
import { CommandType } from '#types';
import { MessageFlags, ApplicationCommandOptionType } from 'discord.js';

export default createCommand({
  name: 'fruit',
  description: 'Comando com autocomplete',
  type: CommandType.ChatInput,
  autocomplete: async (i, focused) => {
    const choices = ['maça', 'banana', 'laranja', 'uva', 'pera', 'abacaxi'];
    const filtered = choices.filter((choice) => choice.startsWith(focused));
    await i.respond(filtered.map((choice) => ({ name: choice, value: choice })));
  },
  options: [
    {
      name: 'fruta',
      description: 'Nome da fruta',
      type: ApplicationCommandOptionType.String,
      required: false,
      autocomplete: true,
    },
  ],
  async run(interaction) {
    const fruit = interaction.options.getString('fruta');
    await interaction.reply({
      content: `Você escolheu a fruta: ${fruit}`,
      flags: [MessageFlags.Ephemeral],
    });
  },
});
