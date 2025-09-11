import { Responder, ResponderType, ResponderInteraction } from '#types';
import { getType } from '#utils';

interface Route<T> extends Responder<string, ResponderType, T> {
  parts: string[];
}

export class ResponderManager {
  private routes: Map<string, Route<any>> = new Map();
  private sessions: Map<string, { valid: boolean; expireAt?: number }> = new Map();

  register<T>(opts: Responder<string, ResponderType, T>) {
    const route: Route<T> = { ...opts, parts: opts.customId.split('/') };
    if (route.cache === 'temporary' && !route.expire) {
      throw new Error("Responder with 'temporary' cache must have an expire time.");
    }
    this.routes.set(opts.customId, route);
    return route;
  }

  private addSession(id: string, cache: 'once' | 'temporary', expire?: number) {
    if (cache === 'once') {
      this.sessions.set(id, { valid: false }); // só pode usar 1 vez
    } else if (cache === 'temporary' && expire) {
      this.sessions.set(id, { valid: true, expireAt: Date.now() + expire });
    }
  }

  private isExpired(id: string): boolean {
    const s = this.sessions.get(id);
    if (!s) return false;

    if (s.expireAt) {
      if (Date.now() > s.expireAt) {
        s.valid = false;
      }
    }

    return !s.valid;
  }

  async run(interaction: ResponderInteraction<ResponderType>) {
    const id = interaction.customId;
    if (!id) return;

    const type = getType(interaction);

    if (this.isExpired(id)) {
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

    const route = [...this.routes.values()].find((r) => {
      if (!r.types.includes(type)) return false;

      const p = id.split('/');
      if (p.length !== r.parts.length) return false;

      return r.parts.every((part, i) => part.startsWith(':') || part === p[i]);
    });

    if (!route) return;

    const params: Record<string, string> = {};
    id.split('/').forEach((value, i) => {
      const part = route.parts[i];
      if (part!.startsWith(':')) params[part!.slice(1)] = value;
    });

    try {
      const data = route.parse ? route.parse(params) : params;

      if (route.cache === 'temporary') {
        if (!this.sessions.has(id)) {
          this.addSession(id, route.cache, route.expire);
        }
      } else if (route.cache === 'once') {
        this.addSession(id, route.cache);
      }

      await route.run(interaction, data);
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
