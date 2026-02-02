import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResizableLayout } from '../ResizableLayout';

// Mock react-resizable-panels to avoid layout engine issues in test env
vi.mock('react-resizable-panels', () => ({
    Panel: ({ children, className, defaultSize, minSize, ...props }: any) => <div data-testid="panel" className={className} {...props}>{children}</div>,
    Group: ({ children }: any) => <div data-testid="panel-group">{children}</div>,
    Separator: ({ children }: any) => <div data-testid="panel-separator">{children}</div>,
}));

describe('ResizableLayout', () => {
    it('renders only left content when right prop is missing', () => {
        render(
            <ResizableLayout
                left={<div data-testid="left-content">Left</div>}
            />
        );

        expect(screen.getByTestId('left-content')).toBeInTheDocument();
        expect(screen.queryByTestId('panel-group')).not.toBeInTheDocument();
        expect(screen.queryByTestId('panel-separator')).not.toBeInTheDocument();
    });

    it('renders split layout when right prop is provided', () => {
        render(
            <ResizableLayout
                left={<div data-testid="left-content">Left</div>}
                right={<div data-testid="right-content">Right</div>}
            />
        );

        expect(screen.getByTestId('panel-group')).toBeInTheDocument();
        expect(screen.getByTestId('panel-separator')).toBeInTheDocument();
        const panels = screen.getAllByTestId('panel');
        expect(panels).toHaveLength(2);

        expect(screen.getByTestId('left-content')).toBeInTheDocument();
        expect(screen.getByTestId('right-content')).toBeInTheDocument();
    });
});
