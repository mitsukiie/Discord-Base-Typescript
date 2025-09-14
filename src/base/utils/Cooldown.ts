export class CooldownManager {
  private cooldowns = new Map<string, number>();

  constructor(private defaultCooldown: number = 3000) {} // 3 segundos padrão

  isOnCooldown(id: string, command: string): boolean {
    const key = `${id}-${command}`;
    const now = Date.now();
    const expire = this.cooldowns.get(key) || 0;
    return now < expire;
  }

  set(id: string, command: string, duration?: number) {
    const key = `${id}-${command}`;
    const now = Date.now();
    this.cooldowns.set(key, now + (duration ?? this.defaultCooldown));
  }

  get(id: string, command: string): number {
    const key = `${id}-${command}`;
    const now = Date.now();
    const expire = this.cooldowns.get(key) || 0;
    return Math.max(0, expire - now);
  }
}