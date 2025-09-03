import { Events } from 'discord.js';
import { createEvent, logger } from '#base';

// Evento: ClientReady
export default createEvent({
  // Nome do evento
  name: Events.ClientReady,

  async run(interaction, client) {
    logger.success(`Bot iniciado como ${client.user?.tag}!`);
  },
});
