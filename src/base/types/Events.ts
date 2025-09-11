import { ClientEvents } from 'discord.js';
import { RunEvent } from '#types';

export type Event<K extends keyof ClientEvents = keyof ClientEvents> = {
  name: K;
  once?: boolean;
  run: RunEvent<K>;
};
