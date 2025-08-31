import { ExtendedClient } from '#base';
import { LoadEvents } from './Load';
import { settings } from '#settings';
import { logger } from '#utils';

// Função responsável por registrar eventos
export async function RegisterEvents(client: ExtendedClient) {
  const events = await LoadEvents();

  events.forEach((event) => {
    // Se o evento for "once", executa apenas uma vez
    if (event.once) {
      client.once(event.name, (...args) => event.run(...args, client));
    }
    // Caso contrário, registra como evento normal (on)
    else {
      client.on(event.name, (...args) => event.run(...args, client));
    }

    if (settings.terminal.showEventsRegistred) {
      logger.success(`⚡ Evento registrado: ${event.name}`);
    }
  });
}
