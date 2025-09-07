import { Collection } from 'discord.js';
import type { Command } from '#types';

// Gerencia os comandos do bot
export class CommandManager {
  private readonly commands = new Collection<string, Command>(); // Armazena os comandos

  public add(name: string, command: Command) {
    this.commands.set(name, command); // Adiciona um comando
  }

  public get(name: string) {
    return this.commands.get(name); // Retorna um comando pelo nome
  }

  public all() {
    return Array.from(this.commands.values()); // Retorna todos os comandos
  }

  public clear() {
    this.commands.clear(); // Limpa todos os comandos
  }

  public size() {
    return this.commands.size; // Retorna a quantidade de comandos
  }
}
