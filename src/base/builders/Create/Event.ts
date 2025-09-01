import { ClientEvents } from 'discord.js';
import { Event } from '#types';

// Função auxiliar para criar eventos de forma tipada.
export function createEvent<K extends keyof ClientEvents>(options: Event<K>): Event<K> {
  return options;
}
