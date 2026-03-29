import { ExtendedClient } from "@base";
import { 
  CommandManager,
  EventManager,
  ResponderManager,
} from "@modules";
import { CooldownManager } from "./utils/Cooldown";

export class App {
  private static instance: App | null = null;

  public readonly client: ExtendedClient;
  public readonly commands: CommandManager;
  public readonly cooldowns: CooldownManager;
  public readonly events: EventManager;
  public readonly responders: ResponderManager;

  private constructor(client: ExtendedClient) {
    this.client = client;
    this.commands = new CommandManager();
    this.cooldowns = new CooldownManager();
    this.events = new EventManager();
    this.responders = new ResponderManager();
  }

  public static init(client: ExtendedClient) {
    if (!this.instance) {
      this.instance = new App(client);
    }
    return this.instance;
  }
  
  public static get() {
    if (!this.instance) {
      throw new Error('App não inicializado');
    }
    return this.instance;
  }
}
