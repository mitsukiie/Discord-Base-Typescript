import { Responder, ResponderType } from "#types";

interface Route<T> extends Responder<string, ResponderType, T> {
    parts: string[];
}

export class route {
    private routes: Map<string, Route<any>> = new Map();

    create<T>(opts: Responder<string, ResponderType, T>) {
        if (opts.cache === 'temporary' && !opts.expire) {
            throw new Error("Responder with 'temporary' cache must have an expire time.");
        }
        const route: Route<T> = { ...opts, parts: opts.customId.split('/') };
        this.routes.set(opts.customId, route);
        return route;
    }

    find(id: any, type: any) {
        return [...this.routes.values()].find((route) => {
            if (!route.types.includes(type)) return false;

            const part = id.split('/');
            if (part.length !== route.parts.length) return false;

            return route.parts.every((p: string, i: number) => p.startsWith(':') || p === part[i]);
        });
    }

    extract(id: string, route: Route<any>) {
        const params: Record<string, string> = {}

        id.split('/').forEach((value, i) => {
            const part = route.parts[i]
            if (!part) return false;

            if (part.startsWith(':')) params[part.slice(1)] = value
        })
        return params;
    }
}