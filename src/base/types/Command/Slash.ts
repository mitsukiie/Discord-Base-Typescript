import { RunS } from '#types';

/**
 * Interface que define a estrutura de um comando do bot.
 *
 * Cada arquivo de comando deve exportar um objeto que siga este contrato.
 */

export interface Command {

  // Nome do comando (obrigatório)
  name: string;

  // Descrição do comando (obrigatório)
  description: string;

  // Opções do comando (argumentos do slash command)
  options?: any[];

  /**
   * Função que será executada quando o comando for chamado.
   *
   * @param interaction → Interação do Discord (ChatInputCommandInteraction)
   * @param client → Instância do ExtendedClient (seu client customizado)
   */

  run: RunS;
}
