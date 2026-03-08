import { AutocompleteInteraction, ClientEvents } from 'discord.js';
import { ExtendedClient } from '@base';
import {
  CommandInteraction,
  CommandType,
  ResponderInteraction,
  ResponderType,
  ResponderParse,
} from '@types';

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
export type RunResponder<T extends ResponderType, Path extends string, P> = (
  interaction: ResponderInteraction<T>,
  params: ResponderParse<P, Path>,
) => unknown | Promise<unknown>;

export type RunAutoComplete = (i: AutocompleteInteraction, focused: string) => any;
