import { ExtendedClient, App } from "@base";
import { logger } from "@utils";
import { Router } from "./Interactions";

class Bootstrap {
  public static async init() {
    const client = new ExtendedClient();
    const app = App.getInstance();

    try {
      if (!process.env.TOKEN) {
        logger.error('O token não está definido no .env!');
        process.exit(1);
      }

      await app.events.load(client);
      await client.login(process.env.TOKEN);
      await app.commands.load(client);

      client.on("interactionCreate", (i) => Router(i, client));
      
    } catch (error) {
      console.error(error);
    }
  }
}

export { Bootstrap };