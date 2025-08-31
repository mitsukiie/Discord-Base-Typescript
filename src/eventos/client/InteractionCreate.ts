import { Events, MessageFlags } from 'discord.js';
import { createEvent } from '#builders';
import { logger } from '#utils';

// Evento: InteractionCreate
export default createEvent({
  // Nome do evento
  name: Events.InteractionCreate,

  // Função executada quando a interação ocorre
  async run(interaction, client) {
    // Ignora interações que não sejam comandos de chat (slash commands)
    if (!interaction.isChatInputCommand()) return;

    // Procura o comando registrado no client
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      logger.error(`O comando ${interaction.commandName} não foi encontrado.`);
      return;
    }

    try {
      // Tenta executar o comando
      await command.run(interaction, client);
    } catch (err) {
      // Se ocorrer erro, mostra no console
      console.error(err);

      // Responde à interação de forma privada, dependendo se já foi respondida ou não
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: '😓 Desculpa, eu acabei tropeçando aqui...\nTente de novo depois!',
          flags: [MessageFlags.Ephemeral], // resposta privada
        });
      } else {
        await interaction.reply({
          content: '😓 Desculpa, eu acabei tropeçando aqui...\nTente de novo depois!',
          flags: [MessageFlags.Ephemeral], // resposta privada
        });
      }
    }
  },
});
