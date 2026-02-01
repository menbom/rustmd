import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
});

// Mock ResizeObserver
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}
window.ResizeObserver = ResizeObserver;

// Mock react-resizable-panels
vi.mock('react-resizable-panels', async () => {
    const React = await import('react');
    return {
        Group: ({ children }: any) => React.createElement('div', { 'data-testid': 'panel-group' }, children),
        Panel: ({ children }: any) => React.createElement('div', { 'data-testid': 'panel' }, children),
        Separator: () => React.createElement('div', { 'data-testid': 'resize-handle' }),
    };
});
