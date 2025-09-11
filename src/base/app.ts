import { CommandManager, EventManager, ResponderManager } from './client/index';
import { settings } from '#settings';

export class App {
  private static instance: App | null = null;

  public readonly commands: CommandManager;
  public readonly events = new EventManager();
  public readonly responders = new ResponderManager();

  public readonly config = settings;

  private constructor() {
    this.commands = new CommandManager();
    this.events = new EventManager();
    this.responders = new ResponderManager();
  }

  public static getInstance() {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }
}
