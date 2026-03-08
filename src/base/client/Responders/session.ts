type Cache = 'once' | 'temporary';
type Data = {
  expireAt?: number;
};

export class session {
  private sessions = new Map<string, Data>();

  add(id: string, cache: Cache, expire?: number) {
    if (cache === 'once') {
      this.sessions.set(id, {});
      return;
    }

    if (cache === 'temporary' && expire) {
      this.sessions.set(id, {
        expireAt: Date.now() + expire,
      });
    }
  }

  isExpired(id: string): boolean {
    const session = this.sessions.get(id);
    if (!session) return false;

    if (session.expireAt && Date.now() > session.expireAt) {
      this.sessions.delete(id);
      return true;
    }

    if (!session.expireAt) {
      this.sessions.delete(id);
      return true;
    }

    return false;
  }

  has(id: string) {
    return this.sessions.has(id);
  }
}
