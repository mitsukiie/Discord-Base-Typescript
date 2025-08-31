import { ExtendedClient } from '#base';

// Função principal para iniciar o bot
async function main() {
  // Cria uma instância do client customizado
  const client = new ExtendedClient();

  // Inicia o client: registra comandos, eventos e faz login no Discord
  await client.start();
}

// Executa a função principal
main();
