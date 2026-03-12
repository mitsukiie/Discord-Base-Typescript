import { Responder, ResponderType, ResponderParser, ResponderParams } from '@types';

export interface Route<
  Path extends string,
  T extends ResponderType,
  Parse extends ResponderParser<Path> | undefined,
> extends Responder<Path, T, Parse> {
  parts: string[];
}

type Router<T extends ResponderType = ResponderType> = Route<
  string,
  T,
  ResponderParser<string> | undefined
>;

function normalize(param: string) {
  return param.replace(/[?+*]$/, '');
}

export class route {
  private routes = new Map<ResponderType, Router[]>();

  create<
    Path extends string,
    T extends ResponderType,
    Parse extends ResponderParser<Path> | undefined = undefined,
  >(opts: Responder<Path, T, Parse>) {
    if (opts.cache === 'temporary' && !opts.expire) {
      throw new Error('Temporary responders must define expire time.');
    }

    const created: Route<Path, T, Parse> = {
      ...opts,
      parts: opts.customId.split('/'),
    };

    const list = this.routes.get(opts.type) ?? [];
    list.push(created as unknown as Router);
    this.routes.set(opts.type, list);

    return created;
  }

  find<T extends ResponderType>(id: string, type: T): Router<T> | null {
    const routes = this.routes.get(type);
    if (!routes) return null;

    const parts = id.split('/');

    for (const route of routes) {
      if (parts.length !== route.parts.length) continue;

      const match = route.parts.every((part, i) => {
        return part.startsWith(':') || part === parts[i];
      });

      if (match) return route as unknown as Router<T>;
    }

    return null;
  }

  extract<
    Path extends string,
    T extends ResponderType,
    Parse extends ResponderParser<Path> | undefined,
  >(id: string, route: Route<Path, T, Parse>): ResponderParams<Path> {
    const params: Record<string, string> = {};
    const values = id.split('/');

    values.forEach((value, i) => {
      const part = route.parts[i];
      if (part?.startsWith(':')) {
        const key = normalize(part.slice(1));
        params[key] = value;
      }
    });

    return params as ResponderParams<Path>;
  }
}
