import { Collection } from 'discord.js';
import type { Event } from '#types';

// Gerencia os eventos do bot
export class EventManager {
  private readonly events = new Collection<string, Event>(); // Armazena os eventos

  public add(event: Event) {
    this.events.set(event.name as string, event); // Adiciona um evento
  }

  public get(name: string) {
    return this.events.get(name); // Retorna um evento pelo nome
  }

  public all() {
    return Array.from(this.events.values()); // Retorna todos os eventos
  }

  public remove(name: string) {
    this.events.delete(name); // Remove um evento pelo nome
  }

  public clear() {
    this.events.clear(); // Limpa todos os eventos
  }

  public size() {
    return this.events.size; // Retorna a quantidade de eventos
  }
}
