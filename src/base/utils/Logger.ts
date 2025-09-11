import chalk from 'chalk';
import { App } from '../app';

/**
 * Logger customizado do bot
 *
 * - Suporta dois modos de exibição (definidos em settings.terminal.mode):
 *   - "informativo": mostra prefixo, data/hora e mensagem
 *   - "minimalista": mostra apenas a mensagem
 *
 * - Tipos de log disponíveis:
 *   - info    → Informações gerais (azul)
 *   - warn    → Avisos (amarelo)
 *   - error   → Erros (vermelho)
 *   - success → Ações concluídas com sucesso (verde)
 */

async function info(msg: any) {
  const app = App.getInstance();
  switch (app.config.terminal.mode) {
    case 'informativo':
      const date = new Date();
      console.log(
        chalk.blueBright(
          `[INFO] [${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}] ${msg}`,
        ),
      );
      break;

    case 'minimalista':
      console.log(chalk.blueBright(`${msg}`));
      break;

    default:
      break;
  }
}

async function warn(msg: any) {
  const app = App.getInstance();
  switch (app.config.terminal.mode) {
    case 'informativo':
      const date = new Date();
      console.log(
        chalk.yellowBright(
          `[WARN] [${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}] ${msg}`,
        ),
      );
      break;

    case 'minimalista':
      console.log(chalk.yellowBright(`${msg}`));
      break;

    default:
      break;
  }
}

async function error(msg: any) {
  const app = App.getInstance();
  switch (app.config.terminal.mode) {
    case 'informativo':
      const date = new Date();
      console.error(
        chalk.redBright(
          `[ERROR] [${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}] ${msg}`,
        ),
      );
      break;

    case 'minimalista':
      console.error(chalk.redBright(`✗ ${msg}`));
      break;

    default:
      break;
  }
}

async function success(msg: any) {
  const app = App.getInstance();
  switch (app.config.terminal.mode) {
    case 'informativo':
      const date = new Date();
      console.log(
        chalk.greenBright(
          `[SUCCESS] [${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}] ${msg}`,
        ),
      );
      break;

    case 'minimalista':
      console.log(chalk.greenBright(`${msg}`));
      break;

    default:
      break;
  }
}

export const logger = {
  info,
  warn,
  success,
  error,
};
