import { settings as configs } from '../settings';

declare global {
    const settings: typeof configs;
}

Object.assign(globalThis, Object.freeze({
    settings: configs,
}));
