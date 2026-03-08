import { Responder, ResponderType } from '@types';

interface Route<Path extends string, T extends ResponderType, P> extends Responder<
  Path,
  T,
  P
> {
  parts: string[];
}

export class route {
  private routes = new Map<ResponderType, Route<any, any, any>[]>();

  create<Path extends string, T extends ResponderType, P>(opts: Responder<Path, T, P>) {
    if (opts.cache === 'temporary' && !opts.expire) {
      throw new Error('Temporary responders must define expire time.');
    }

    const route: Route<Path, T, P> = {
      ...opts,
      parts: opts.customId.split('/'),
    };

    const list = this.routes.get(opts.type) || [];
    list.push(route);
    this.routes.set(opts.type, list);

    return route;
  }

  find(id: string, type: ResponderType) {
    const routes = this.routes.get(type);
    if (!routes) return null;

    const parts = id.split('/');

    for (const route of routes) {
      if (parts.length !== route.parts.length) continue;

      const match = route.parts.every((part, i) => {
        return part.startsWith(':') || part === parts[i];
      });

      if (match) return route;
    }

    return null;
  }

  extract(id: string, route: Route<any, any, any>) {
    const params: Record<string, string> = {};
    const values = id.split('/');

    values.forEach((value, i) => {
      const part = route.parts[i];
      if (part?.startsWith(':')) {
        const key = part.slice(1);
        params[key] = value;
      }
    });
    return params;
  }
}
