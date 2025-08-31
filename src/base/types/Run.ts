import { ChatInputCommandInteraction, ClientEvents } from 'discord.js';
import { ExtendedClient } from '#base';

// Run event
export type RunE<K extends keyof ClientEvents = keyof ClientEvents> = (
  ...args: [...ClientEvents[K], ExtendedClient]
) => Promise<void> | void;

// run slash command
export type RunS = (
  interaction: ChatInputCommandInteraction,
  client: ExtendedClient,
) => Promise<void>;
