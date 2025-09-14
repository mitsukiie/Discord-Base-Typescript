export class session {
    private sessions: Map<string, { valid: boolean; expireAt?: number }> = new Map();

    add(id: string, cache: 'once' | 'temporary', expire?: number) {
        if (cache === 'once') {
            this.sessions.set(id, { valid: false });
        } else if (cache === 'temporary' && expire) {
            this.sessions.set(id, { valid: true, expireAt: Date.now() + expire });
        }
    }

    isExpired(id: string): boolean {
        const i = this.sessions.get(id);
        if (!i) return false;

        if (i.expireAt && Date.now() > i.expireAt) {
            i.valid = false;
        }
        return !i.valid;
    }

    has(id: string) {
        return this.sessions.has(id);
    }
}