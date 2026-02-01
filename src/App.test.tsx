import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock Tauri plugins
vi.mock('@tauri-apps/plugin-dialog', () => ({
    open: vi.fn(),
    save: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-fs', () => ({
    readTextFile: vi.fn(),
    writeTextFile: vi.fn(),
}));

// Mock utils
vi.mock('./utils/platform', () => ({
    isTauri: () => false,
}));

// Mock child components to check structure
vi.mock('./components/TitleBar', () => ({
    TitleBar: () => <div data-testid="title-bar" />,
}));
vi.mock('./components/Editor', () => ({
    EditorWrapper: () => <div data-testid="editor-wrapper" />,
}));

// Mock ResizableLayout to verify it's used
vi.mock('./components/ResizableLayout', () => ({
    ResizableLayout: ({ left, right }: any) => (
        <div data-testid="resizable-layout">
            <div data-testid="layout-left">{left}</div>
            <div data-testid="layout-right">{right}</div>
        </div>
    ),
}));

describe('App Integration', () => {
    it('renders TitleBar and ResizableLayout', () => {
        render(<App />);
        expect(screen.getByTestId('title-bar')).toBeInTheDocument();

        // This should fail initially because App uses simple div layout currently
        expect(screen.getByTestId('resizable-layout')).toBeInTheDocument();
        expect(screen.getByTestId('editor-wrapper')).toBeInTheDocument();
    });
});
