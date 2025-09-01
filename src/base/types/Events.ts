import { ClientEvents } from 'discord.js';
import { RunE } from '#types';

// Tipo genérico para tipar eventos do bot
export type Event<K extends keyof ClientEvents = keyof ClientEvents> = {
  name: K;
  once?: boolean;
  run: RunE<K>;
};
