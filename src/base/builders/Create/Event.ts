import { ClientEvents } from 'discord.js';
import { Event } from '#types';

/**
 * Função auxiliar para criar eventos de forma tipada.
 *
 * @param options → Objeto que segue a interface Event<K>
 * @returns O próprio objeto de evento, validado pelo TypeScript
 *
 */

export function createEvent<K extends keyof ClientEvents>(options: Event<K>): Event<K> {
  return options;
}
