import { ExtendedClient, App } from "@base";
import { logger } from "@utils";
import { loadCommands, loadEvents } from "@modules";
import { Router } from "./Interactions";

const Bootstrap = {
  async init() {
    const client = new ExtendedClient();
    App.init(client);
    client.on("interactionCreate", (interaction) => Router(interaction));

    try {
      if (!process.env.TOKEN) {
        logger.error('O token não está definido no .env!');
        process.exit(1);
      }

      await loadEvents(client);
      await client.login(process.env.TOKEN);
      await loadCommands(client);
      
    } catch (error) {
      console.error(error);
    }
  }
}

export { Bootstrap };