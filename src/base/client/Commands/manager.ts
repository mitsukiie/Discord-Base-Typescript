import { Collection } from 'discord.js';
import type { Command } from '#types';

import { Commands } from './handler';

export class CommandManager {
  private readonly commands = new Collection<string, Command>();

  public load(client: any) {
    return Commands(client);
  }

  public add(name: string, command: Command) {
    this.commands.set(name, command);
  }

  public get(name: string) {
    return this.commands.get(name);
  }

  public all() {
    return Array.from(this.commands.values());
  }

  public clear() {
    this.commands.clear();
  }

  public size() {
    return this.commands.size;
  }
}
