import { Interaction } from 'discord.js';
import { ZodType } from 'zod';
import { getType } from '@utils';
import { session } from './session';
import { route } from './route';

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

      if (route.cache === 'temporary' && !this.sessions.has(id)) {
        this.sessions.add(id, route.cache, route.expire);
      }

      if (route.cache === 'once') {
        this.sessions.add(id, route.cache);
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
