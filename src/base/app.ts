import { CommandManager, EventManager, ResponderManager } from './client/index';
import { CooldownManager } from './utils/Cooldown';

export class App {
  private static instance: App | null = null;

  public readonly commands: CommandManager;
  public readonly cooldowns = new CooldownManager();
  public readonly events = new EventManager();
  public readonly responders = new ResponderManager();

  private constructor() {
    this.commands = new CommandManager();
    this.cooldowns = new CooldownManager();
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
