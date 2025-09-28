import { Collection } from 'discord.js';
import type { Event } from '#types';

import { Events } from './handler';

export class EventManager {
  private readonly events = new Collection<string, Event>();

  public load(client: any) {
    return Events(client);
  }

  public add(event: Event) {
    this.events.set(event.name, event);
  }

  public get(name: string) {
    return this.events.get(name);
  }

  public all() {
    return Array.from(this.events.values());
  }

  public remove(name: string) {
    this.events.delete(name);
  }

  public clear() {
    this.events.clear();
  }

  public size() {
    return this.events.size;
  }
}
