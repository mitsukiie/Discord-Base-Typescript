import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ChatInputCommandInteraction,
  MessageFlags,
} from 'discord.js';

// Importações internas do projeto
import { App } from '../app';
import { RegisterCommands, RegisterEvents } from './index';
import { logger } from '#base';

// Classe que estende o Client padrão do Discord
export class ExtendedClient extends Client {
  public commands: Collection<string, any> = new Collection(); // Armazena comandos carregados

  // Construtor do client personalizado
  constructor() {
    super({
      intents: Object.values(GatewayIntentBits) as GatewayIntentBits[], // Todos os intents
      partials: Object.values(Partials) as Partials[], // Todos os partials
    });
  }

  // Lida com interações de slash commands
  private async handleInteraction(interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return; // Filtra apenas comandos de chat
    const app = App.getInstance();

    const command = app.commands.get(interaction.commandName); // Busca o comando registrado
    if (!command) return;

    try {
      await command.run(interaction, this); // Executa o comando
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
    try {
      await RegisterEvents(this); // Registra eventos

      if (!process.env.TOKEN) {
        logger.error('O token não está definido no .env!');
        process.exit(1);
      }

      await this.login(process.env.TOKEN); // Login do bot
      await RegisterCommands(this); // Registra comandos

      // Listener central para interações de chat input
      this.on('interactionCreate', (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        this.handleInteraction(interaction);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
