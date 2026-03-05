import {
  Client,
  GatewayIntentBits,
  Partials,
} from 'discord.js';
import '../settings';

export class ExtendedClient extends Client {

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
      ],
    });
  }
  
}