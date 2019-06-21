import {LegacyApi} from '@sakuli/legacy'

declare const api: LegacyApi;

declare global {
    const _getText: typeof api._getText
}