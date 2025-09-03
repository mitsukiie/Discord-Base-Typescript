import { ApplicationCommandType, ClientEvents } from 'discord.js';
import { ExtendedClient } from '#base';
import { Interactions } from '#types';

// Run event
export type RunE<K extends keyof ClientEvents = keyof ClientEvents> = (
  ...args: [...ClientEvents[K], ExtendedClient]
) => any;

// Run slash command
export type RunS<K extends ApplicationCommandType> = (
  interaction: Interactions[K],
  client?: ExtendedClient,
) => any;