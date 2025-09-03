import { Events, MessageFlags } from 'discord.js';
import { createEvent, logger } from '#base';

// Evento: InteractionCreate
export default createEvent({
  // Nome do evento
  name: Events.InteractionCreate,

  // Função executada quando a interação ocorre
  async run(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    // Procura o comando registrado no client
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      logger.error(`O comando ${interaction.commandName} não foi encontrado.`);
      return;
    }

    try {
      await command.run(interaction, client);
    } catch (err) {
      console.error(err);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: '😓 Desculpa, eu acabei tropeçando aqui...\nTente de novo depois!',
          flags: [MessageFlags.Ephemeral],
        });
      } else {
        await interaction.reply({
          content: '😓 Desculpa, eu acabei tropeçando aqui...\nTente de novo depois!',
          flags: [MessageFlags.Ephemeral],
        });
      }
    }
  },
});
