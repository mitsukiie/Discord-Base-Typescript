import { Interaction } from 'discord.js';
import { ZodType } from 'zod';
import { getType } from '@utils';
import { CacheType } from '@types';
import { session } from './session';
import { route } from './route';

function CheckInteractionType(
  interaction: Interaction,
  cacheType?: CacheType,
) {
  if (!cacheType) return true;

  if (cacheType === 'cached') return interaction.inCachedGuild();
  if (cacheType === 'guild') return interaction.inGuild();

  return true;
}

function CacheErrorMessage(cacheType: CacheType) {
  if (cacheType === 'cached') {
    return 'Esta interação exige servidor em cache para continuar.';
  }

  if (cacheType === 'guild') {
    return 'Esta interação só pode ser usada dentro de servidor.';
  }

  return 'Esta interação exige contexto raw de servidor.';
}

export class ResponderManager {
  private routes = new route();
  private sessions = new session();

  register = this.routes.create.bind(this.routes);

  async run(interaction: Interaction) {
    if (!('customId' in interaction)) return;
    const id = interaction.customId;

    const type = getType(interaction);
    if (!type) return;

    if (this.sessions.isExpired(id)) {
      if ('reply' in interaction && interaction.isRepliable() && !interaction.replied) {
        await interaction
          .reply({
            content: 'Esta interação não está mais disponível.',
            flags: ['Ephemeral'],
          })
          .catch(() => {});
      }
      return;
    }

    const route = this.routes.find(id, type);
    if (!route) return;

    const cache = route.cache;
    if (cache && !CheckInteractionType(interaction, cache)) {
      if ('reply' in interaction && interaction.isRepliable() && !interaction.replied) {
        await interaction
          .reply({
            content: CacheErrorMessage(cache),
            flags: ['Ephemeral'],
          })
          .catch(() => {});
      }
      return;
    }

    try {
      const params = this.routes.extract(id, route);

      let data: any = params;

      if (route.parse) {
        if (typeof route.parse === 'function') {
          data = route.parse(params);
        } else if (route.parse instanceof ZodType) {
          data = route.parse.parse(params);
        }
      }

      if (route.lifetime === 'temporary' && !this.sessions.has(id)) {
        this.sessions.add(id, route.lifetime, route.expire);
      }

      if (route.lifetime === 'once') {
        this.sessions.add(id, route.lifetime);
      }

      await route.run(interaction as any, data);
    } catch (err) {
      console.error('Responder error:', err);
      if ('reply' in interaction && interaction.isRepliable() && !interaction.replied) {
        await interaction
          .reply({
            content: 'Erro ao processar interação.',
            flags: ['Ephemeral'],
          })
          .catch(() => {});
      }
    }
  }
}
