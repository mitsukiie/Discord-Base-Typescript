import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ChatInputCommandInteraction,
  MessageFlags,
} from 'discord.js';

// Importações internas do projeto
import { App } from '#base';
import { RegisterCommands, RegisterEvents } from './';
import { isResponder, logger } from '#utils';

export class ExtendedClient extends Client {
  public commands: Collection<string, any> = new Collection();

  constructor() {
    super({
      intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
      partials: Object.values(Partials) as Partials[],
    });
  }

  private async handleInteraction(interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return;
    const app = App.getInstance();

    const command = app.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.run(interaction, this);
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
  }

  // Inicializa o bot
  public async start() {
    const app = App.getInstance();
    try {
      await RegisterEvents(this);

      if (!process.env.TOKEN) {
        logger.error('O token não está definido no .env!');
        process.exit(1);
      }

      await this.login(process.env.TOKEN);
      await RegisterCommands(this);

      // Listener central para interações de chat input
      this.on('interactionCreate', async (interaction) => {
        // comandos slash
        if (interaction.isChatInputCommand()) {
          const command = app.commands.get(interaction.commandName);
          if (command) await command.run(interaction);
        }

        // qualquer interação (botão, modal, select)
        if (isResponder(interaction)) {
          await app.responders.run(interaction);
          return;
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}
