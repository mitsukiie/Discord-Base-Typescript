import { ExtendedClient } from '#base';

async function main() {
  const client = new ExtendedClient();
  await client.start();
}

main();
