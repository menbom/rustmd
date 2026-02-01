import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResizableLayout } from './ResizableLayout';

describe('ResizableLayout', () => {
    it('renders children correctly', () => {
        render(
            <ResizableLayout
                left={<div data-testid="left-pane">Left</div>}
                right={<div data-testid="right-pane">Right</div>}
            />
        );

        expect(screen.getByTestId('left-pane')).toBeInTheDocument();
        expect(screen.getByTestId('right-pane')).toBeInTheDocument();
    });

    it('renders only left pane when right is missing', () => {
        render(
            <ResizableLayout
                left={<div data-testid="left-pane">Left</div>}
            />
        );

        expect(screen.getByTestId('left-pane')).toBeInTheDocument();
        expect(screen.queryByTestId('right-pane')).not.toBeInTheDocument();
    });
});
