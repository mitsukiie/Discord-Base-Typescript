import { glob } from 'glob';
import path from 'path';
import { pathToFileURL } from 'url';

// Importações internas do projeto
import { ExtendedClient, App } from '#base';
import { Event } from '#types';
import { logger } from '#utils';

export async function RegisterEvents(client: ExtendedClient) {
  const app = App.getInstance();
  const files = await glob(`./src/events/**/*.ts`);

  if (app.config.terminal.showEventsFiles) {
    logger.info('🔄 Iniciando o carregamento de eventos...');
    logger.success(`📂 Total de eventos encontrados: ${files.length}`);
  }

  await Promise.all(
    files.map(async (file) => {
      const url = pathToFileURL(path.resolve(file)).href;
      const module = await import(url);
      const event: Event = module.default;

      if (!event?.name || !event?.run) {
        logger.warn(`⚠️ Evento inválido ignorado: ${file}`);
        return;
      }

      app.events.add(event);
    }),
  );

  const events = app.events.all();

  events.forEach((event) => {
    if (event.once) {
      client.once(event.name, (...args) => event.run(...args, client));
    } else {
      client.on(event.name, (...args) => event.run(...args, client));
    }

    if (app.config.terminal.showEventsRegistred) {
      logger.success(`⚡ Evento registrado: ${event.name}`);
    }
  });
}
