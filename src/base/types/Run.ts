import { AutocompleteInteraction, ClientEvents } from 'discord.js';
import { ExtendedClient } from '@base';
import { CommandInteraction, CommandType, ResponderParse } from '@types';

// Run event
export type RunEvent<K extends keyof ClientEvents = keyof ClientEvents> = (
  ...args: [...ClientEvents[K], ExtendedClient]
) => any;

// Run slash command
export type RunCommand<T extends CommandType> = (
  interaction: CommandInteraction<T>,
  client?: ExtendedClient,
) => any;

// Run responder
export type RunResponder<I, Path extends string, P = undefined> = (
  interaction: I,
  params: ResponderParse<P, Path>,
) => unknown | Promise<unknown>;

export type RunAutoComplete = (i: AutocompleteInteraction, focused: string) => any;
