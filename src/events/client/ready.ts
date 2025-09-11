import { Events } from 'discord.js';
import { createEvent } from '#base';
import { logger } from '#utils';

export default createEvent({
  name: Events.ClientReady,

  async run(interaction, client) {
    logger.success(`Bot iniciado como ${client.user?.tag}!`);
  },
});
