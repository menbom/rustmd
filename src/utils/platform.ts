export const isTauri = (): boolean => {
    // @ts-ignore
    return typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;
};
