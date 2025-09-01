import { Events } from 'discord.js';
import { createEvent } from '#builders';
import { logger } from '#utils';

// Evento: ClientReady
export default createEvent({
  // Nome do evento
  name: Events.ClientReady,

  async run(interaction, client) {
    logger.success(`Bot iniciado como ${client.user?.tag}!`);
  },
});
