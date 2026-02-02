import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TitleBar } from '../TitleBar';

// Mock dependencies
const mockMinimize = vi.fn();
const mockToggleMaximize = vi.fn();
const mockClose = vi.fn();
const mockStartDragging = vi.fn();
const mockListen = vi.fn(() => Promise.resolve(() => { }));
const mockIsMaximized = vi.fn(() => Promise.resolve(false));

vi.mock('@tauri-apps/api/window', () => ({
    getCurrentWindow: () => ({
        minimize: mockMinimize,
        toggleMaximize: mockToggleMaximize,
        close: mockClose,
        startDragging: mockStartDragging,
        listen: mockListen,
        isMaximized: mockIsMaximized,
    }),
}));

// Mock platform utils
const mockIsTauri = vi.fn();
vi.mock('../../utils/platform', () => ({
    isTauri: () => mockIsTauri(),
}));

describe('TitleBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsTauri.mockReturnValue(true); // Default to Tauri env
        mockIsMaximized.mockReturnValue(Promise.resolve(false));
        mockListen.mockReturnValue(Promise.resolve(() => { }));
    });

    it('renders nothing when not in Tauri environment', () => {
        mockIsTauri.mockReturnValue(false);
        const { container } = render(<TitleBar />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders correctly in Tauri environment', () => {
        render(<TitleBar />);
        expect(screen.getByText('RustMD')).toBeInTheDocument();
        expect(screen.getByTitle('Minimize')).toBeInTheDocument();
        expect(screen.getByTitle('Maximize')).toBeInTheDocument();
        expect(screen.getByTitle('Close')).toBeInTheDocument();
    });

    it('calls minimize window function on click', () => {
        render(<TitleBar />);
        const btn = screen.getByTitle('Minimize');
        fireEvent.click(btn);
        expect(mockMinimize).toHaveBeenCalled();
    });

    it('calls toggleMaximize window function on click', async () => {
        render(<TitleBar />);
        const btn = screen.getByTitle('Maximize');
        fireEvent.click(btn);
        expect(mockToggleMaximize).toHaveBeenCalled();

        // Wait for state update (isMaximized check)
        await waitFor(() => expect(mockIsMaximized).toHaveBeenCalled());
    });

    it('calls close window function on click', () => {
        render(<TitleBar />);
        const btn = screen.getByTitle('Close');
        fireEvent.click(btn);
        expect(mockClose).toHaveBeenCalled();
    });

    it('starts dragging on mouse down on drag region', () => {
        render(<TitleBar />);
        const dragRegion = screen.getByTestId('drag-region');
        fireEvent.mouseDown(dragRegion);
        expect(mockStartDragging).toHaveBeenCalled();
    });

    it('updates maximize icon state when window is maximized', async () => {
        mockIsMaximized.mockResolvedValueOnce(true);
        render(<TitleBar />);

        // Wait for effect
        await waitFor(() => expect(mockIsMaximized).toHaveBeenCalled());

        // Should show restore button (Title changes)
        expect(screen.getByTitle('Restore')).toBeInTheDocument();
    });
});
