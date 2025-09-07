import { CommandManager, EventManager } from './client/index';
import { settings } from '#settings';

// Classe principal da aplicação (Singleton)
export class App {
  private static instance: App | null = null; // Instância única

  public readonly commands: CommandManager; // Gerenciador de comandos
  public readonly events = new EventManager(); // Gerenciador de eventos

  public readonly config = settings; // Configurações do bot

  private constructor() {
    this.commands = new CommandManager(); // Inicializa CommandManager
    this.events = new EventManager(); // Inicializa EventManager
  }

  public static getInstance() {
    if (!App.instance) {
      App.instance = new App(); // Cria a instância se não existir
    }
    return App.instance; // Retorna a instância única
  }
}
