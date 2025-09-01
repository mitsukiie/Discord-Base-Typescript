import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// Importações internas do projeto
import { ExtendedClient } from '#base';
import { createSubcommandGroup } from '#builders';
import { logger } from '#utils';
import { settings } from '#settings';

// Função responsável por carregar os comandos do bot
export async function LoadCommands(client: ExtendedClient) {
  const commands: any[] = [];

  // Caminho da pasta onde ficam os comandos
  const folders = path.join(process.cwd(), 'src', 'comandos');
  const categories = readdirSync(folders);

  if (settings.terminal.showSlashCommandsFiles) {
    logger.info('🔄 Iniciando o carregamento de comandos...');
    logger.success(`📂 Total de categorias: ${categories.length}`);
  }

  // Percorre cada categoria de comandos
  await Promise.all(
    categories.map(async (categorie) => {
      const categoryPath = path.join(folders, categorie);
      const entries = readdirSync(categoryPath, { withFileTypes: true });

      if (settings.terminal.showSlashCommandsFiles) {
        logger.success(`📂 Categoria: ${categorie} - ${entries.length} comandos`);
      }

      // Percorre cada entrada dentro da categoria (pode ser pasta ou arquivo)
      await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(categoryPath, entry.name);

          // Caso seja uma pasta, tratamos como grupo de subcomandos
          if (entry.isDirectory()) {
            const command = await createSubcommandGroup(
              entry.name,
              `Comando ${entry.name} com subcomandos`,
              fullPath,
            );

            // Adiciona o comando na lista e no client
            commands.push(command.data);
            client.commands.set(entry.name, command);
          }

          // Caso seja um arquivo .ts, tratamos como comando único
          else if (entry.isFile() && entry.name.endsWith('.ts')) {
            const url = pathToFileURL(path.resolve(fullPath)).href;
            const module = await import(url);
            const command = module.default;

            if (!command) {
              logger.warn(`⚠️ Arquivo ignorado (sem export default): ${entry.name}`);
              return;
            }

            commands.push(command.data);
            client.commands.set(command.data.name, command);

            if (settings.terminal.showSlashCommandsFiles) {
              logger.success(`📄 Comando carregado: ${command.data.name}`);
            }
          }

          // Caso não seja nem pasta nem .ts, apenas logamos que foi ignorado
          else {
            logger.warn(`⚠️ Entrada ignorada: ${entry.name}`);
          }
        }),
      );
    }),
  );

  return commands;
}
