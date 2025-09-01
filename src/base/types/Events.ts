import { ClientEvents } from 'discord.js';
import { RunE } from '#types';

/**
 * Tipo genérico para tipar eventos do bot
 *
 * - `K` → Representa o nome do evento (ex.: "ready", etc.)
 * - `ClientEvents[K]` → Representa os parâmetros que o evento recebe (definidos pelo Discord.js)
 * - `ExtendedClient` → O client customizado do seu projeto (adicionado como último argumento)
 */

export type Event<K extends keyof ClientEvents = keyof ClientEvents> = {
  // Nome do evento (precisa existir em ClientEvents)
  name: K;

  // Se true, o evento só será executado uma vez (equivale a client.once)
  once?: boolean;

  /**
   * Função executada quando o evento é disparado
   *
   * @param args → Argumentos do evento (variam de acordo com o evento escolhido)
   * @param client → Instância do ExtendedClient
   *
   * Pode retornar uma Promise (async) ou nada (void).
   */

  run: RunE<K>;
};
