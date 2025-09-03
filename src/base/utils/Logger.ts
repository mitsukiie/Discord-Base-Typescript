import chalk from 'chalk';

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

/** Log informativo (azul) */
async function info(msg: any) {
  switch (settings.terminal.mode) {
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

/** Log de aviso (amarelo) */
async function warn(msg: any) {
  switch (settings.terminal.mode) {
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

/** Log de erro (vermelho) */
async function error(msg: any) {
  switch (settings.terminal.mode) {
    case 'informativo':
      const date = new Date();
      console.log(
        chalk.redBright(
          `[ERROR] [${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}] ${msg}`,
        ),
      );
      break;

    case 'minimalista':
      console.log(chalk.redBright(`✗ ${msg}`));
      break;

    default:
      break;
  }
}

/** Log de sucesso (verde) */
async function success(msg: any) {
  switch (settings.terminal.mode) {
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

/** Objeto exportado com todos os tipos de log */
export const logger = {
  info,
  warn,
  success,
  error,
};
