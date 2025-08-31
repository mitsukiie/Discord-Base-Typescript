import { glob } from 'glob';
import path from 'path';
import { pathToFileURL } from 'url';

// Importações internas do projeto
import { Event } from '#types';
import { settings } from '#settings';
import { logger } from '#utils';

// Função responsável por carregar os eventos
export async function LoadEvents(): Promise<Event[]> {
  // Busca todos os arquivos dentro de src/eventos/**/*.ts
  const files = await glob(`./src/eventos/**/*.ts`);

  if (settings.terminal.showEventsFiles) {
    logger.info('🔄 Iniciando o carregamento de eventos...');
    logger.success(`📂 Total de eventos encontrados: ${files.length}`);
  }

  const events: Event[] = [];

  // Carrega cada evento encontrado
  await Promise.all(
    files.map(async (file) => {
      const url = pathToFileURL(path.resolve(file)).href;
      const module = await import(url);
      const event: Event = module.default;

      // Se não tiver estrutura válida, ignora
      if (!event?.name || !event?.run) {
        logger.warn(`⚠️ Evento inválido ignorado: ${file}`);
        return;
      }

      // Adiciona o evento na lista
      events.push(event);
    }),
  );

  return events;
}
