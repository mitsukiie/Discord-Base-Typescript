import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
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
      this.on('interactionCreate', async (i) => {
        // comandos slash
        if (i.isChatInputCommand()) {
          const name = i.commandName;
          const id = i.user.id;
          const command = app.commands.get(name);
          if (!command) return;

          if (app.cooldowns.isOnCooldown(id, name)) {
            const remaining = app.cooldowns.get(id, name) / 1000;
            return i.reply({
              content: `⏳ Calma aí! Você precisa esperar **${remaining.toFixed(1)}s** antes de usar esse comando de novo.`,
              flags: [MessageFlags.Ephemeral],
            });
          }

          try {
            await command.run(i, this);
            app.cooldowns.set(id, name, command.cooldown ?? undefined);
          } catch (err) {
            console.error(err);
            if (i.replied || i.deferred) {
              await i.followUp({
                content:
                  '😓 Desculpa, eu acabei tropeçando aqui...\nTente de novo depois!',
                flags: [MessageFlags.Ephemeral],
              });
            } else {
              await i.reply({
                content:
                  '😓 Desculpa, eu acabei tropeçando aqui...\nTente de novo depois!',
                flags: [MessageFlags.Ephemeral],
              });
            }
          }
        }

        if (i.isAutocomplete()) {
          const focused = i.options.getFocused();
          const command = app.commands.get(i.commandName);
          if (command && command.autocomplete) await command.autocomplete(i, focused);
          return;
        }

        // qualquer interação (botão, modal, select)
        if (isResponder(i)) {
          await app.responders.run(i);
          return;
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}
