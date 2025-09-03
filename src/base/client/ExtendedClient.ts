import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';

// Importações internas do projeto
import { RegisterCommands, RegisterEvents } from './index';
import { logger } from '#base';

// Classe que estende o Client padrão do Discord
export class ExtendedClient extends Client {
  public commands: Collection<string, any> = new Collection();

  // Construtor da classe
  constructor() {
    super({
      // Define todos os intents disponíveis do Discord (para receber eventos)
      intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
      // Define todos os partials disponíveis (para trabalhar com objetos parcialmente carregados)
      partials: Object.values(Partials) as Partials[],
    });
  }

  // Método principal para iniciar o bot
  public async start() {
    try {
      // Registra todos os eventos do bot
      await RegisterEvents(this);

      if (!settings.bot.token) {
        logger.error('O token não está definido no .env!');
        process.exit(1);
      }

      // Faz login no Discord usando o token definido nas configurações (settings.ts)
      await this.login(settings.bot.token);

      // Registra todos os comandos do bot
      await RegisterCommands(this);
    } catch (error) {
      console.error(error);
    }
  }
}
