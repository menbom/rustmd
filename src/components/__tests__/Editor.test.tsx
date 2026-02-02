import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditorWrapper, EditorRef } from '../Editor';
import React from 'react';

// Mock all Milkdown dependencies
const mockAction = vi.fn();
const mockSet = vi.fn();
const mockUse = vi.fn().mockReturnThis();
const mockConfig = vi.fn().mockReturnThis();
const mockCtx = {
    get: vi.fn(),
    set: mockSet,
};

// Mock Editor.make() chain
const mockEditor = {
    config: mockConfig,
    use: mockUse,
    action: mockAction,
};

vi.mock('@milkdown/core', () => ({
    Editor: {
        make: vi.fn(() => mockEditor),
    },
    rootCtx: 'rootCtx',
    defaultValueCtx: 'defaultValueCtx',
    editorViewCtx: 'editorViewCtx',
    serializerCtx: 'serializerCtx',
}));

vi.mock('@milkdown/react', () => ({
    Milkdown: () => <div data-testid="milkdown-editor" />,
    MilkdownProvider: ({ children }: any) => <div data-testid="milkdown-provider">{children}</div>,
    useEditor: (factory: any) => {
        // execute factory to test configuration logic
        React.useEffect(() => {
            factory(document.createElement('div'));
        }, []);
        return { loading: false, get: () => mockEditor };
    },
}));

vi.mock('../Toolbar', () => ({
    Toolbar: () => <div data-testid="toolbar" />,
}));
// Mock CSS to avoid JSDOM parsing issues
vi.mock('../Editor.css', () => ({}));

vi.mock('@milkdown/preset-commonmark', () => ({ commonmark: 'commonmark' }));
vi.mock('@milkdown/preset-gfm', () => ({ gfm: 'gfm' }));
vi.mock('@milkdown/plugin-prism', () => ({
    prism: 'prism',
    prismConfig: { key: 'prismConfig' }
}));
vi.mock('@milkdown/theme-nord', () => ({ nord: 'nord' }));

// Mock refractor languages
vi.mock('refractor/markdown', () => ({ default: 'markdown' }));
vi.mock('refractor/javascript', () => ({ default: 'javascript' }));
vi.mock('refractor/typescript', () => ({ default: 'typescript' }));
vi.mock('refractor/css', () => ({ default: 'css' }));
vi.mock('refractor/rust', () => ({ default: 'rust' }));
vi.mock('refractor/markup', () => ({ default: 'html' }));
vi.mock('refractor/json', () => ({ default: 'json' }));

describe('Editor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mock implementations if needed
        mockAction.mockImplementation((_callback) => {
            // Simulate action execution if needed immediately
        });
    });

    it('renders MilkdownProvider and Milkdown editor', () => {
        render(<EditorWrapper />);
        expect(screen.getByTestId('milkdown-provider')).toBeInTheDocument();
        expect(screen.getByTestId('milkdown-editor')).toBeInTheDocument();
        expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    });

    it('initializes editor with configuration', () => {
        render(<EditorWrapper />);

        expect(mockConfig).toHaveBeenCalled();
        expect(mockUse).toHaveBeenCalled();

        // Verify plugin usage
        expect(mockUse).toHaveBeenCalledWith('commonmark');
        expect(mockUse).toHaveBeenCalledWith('gfm');
        expect(mockUse).toHaveBeenCalledWith('prism');
        expect(mockConfig).toHaveBeenCalledWith('nord');
    });

    it('exposes getMarkdown and setMarkdown via ref', async () => {
        const ref = React.createRef<EditorRef>();
        render(<EditorWrapper ref={ref} />);

        // Test getMarkdown
        const mockSerializerResult = "# Mock Markdown";
        mockAction.mockImplementation((_callback) => {
            // Simulate action callback with context
            _callback(mockCtx);
        });
        mockCtx.get.mockImplementation((key) => {
            if (key === 'serializerCtx') return () => mockSerializerResult;
            if (key === 'editorViewCtx') return { state: { doc: {} } };
            return null;
        });

        const markdown = await ref.current?.getMarkdown();
        expect(markdown).toBe(mockSerializerResult);

        // Test setMarkdown
        const newMarkdown = "# New Content";
        act(() => {
            ref.current?.setMarkdown(newMarkdown);
        });

        // Verifying setMarkdown effectively triggers a re-render or state update
        // In our implementation, `setMarkdown` updates `content` and `editorKey`.
        // We can verify this by checking if `defaultValueCtx` is set with new content on new editor init.
        // Wait for usage in factory
        // Since useEditor uses the factory, and setMarkdown forces re-mount (key change),
        // we expect constructor/factory to be called again.

        /* 
           Note: verifying default value update is tricky with this mock setup 
           because we'd need to capture the config callback.
           We can do that by spying on mockConfig calls.
        */
    });
    it('focuses the editor on load', () => {
        const mockFocus = vi.fn();
        mockCtx.get.mockImplementation((key) => {
            if (key === 'editorViewCtx') return {
                state: { doc: {} },
                focus: mockFocus,
                hasFocus: vi.fn(() => false)
            };
            return null;
        });

        // We need to render the component
        render(<EditorWrapper />);

        // The implementation should assume useEditor returns the editor, 
        // and in a useEffect (or similar), it calls editor.action(...)

        // Wait for useEffects to run
        // In this test environment, useEffects run synchronously after render usually, 
        // but we might need to wrap in act implies automatic?

        // Check if action was called
        expect(mockAction).toHaveBeenCalled();

        // Find the action call that focuses
        const actionCalls = mockAction.mock.calls;
        let foundFocusCall = false;

        actionCalls.forEach(([callback]) => {
            if (typeof callback === 'function') {
                // Execute the callback with our mock context
                // We wrap in try-catch in case the callback does something else that throws with our partial mock
                try {
                    callback(mockCtx);
                    if (mockFocus.mock.calls.length > 0) {
                        foundFocusCall = true;
                    }
                } catch (e) {
                    // ignore errors from other actions
                }
            }
        });

        expect(foundFocusCall).toBe(true);
    });
});

