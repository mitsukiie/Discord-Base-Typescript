import { settings as Settings } from '../settings'

declare global {
    const settings: typeof Settings
}

Object.assign(globalThis, Object.freeze({
    settings: Settings
}));