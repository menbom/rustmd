import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Toolbar } from '../Toolbar';
import {
    toggleStrongCommand,
    toggleEmphasisCommand,
    wrapInHeadingCommand
} from '@milkdown/preset-commonmark';
import { callCommand } from '@milkdown/utils';

// Mock milkdown dependencies
const mockAction = vi.fn();
const mockGetEditor = vi.fn();

vi.mock('@milkdown/react', () => ({
    useInstance: () => [false, mockGetEditor],
}));

vi.mock('@milkdown/utils', () => ({
    callCommand: vi.fn((cmd, payload) => ({ cmd, payload })),
}));

// We check if the command passed is the one we expect.
// Since we are not mocking preset-commonmark entirely, we use the real import reference
// or we can just spy on callCommand to see if it received the right object.

describe('Toolbar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetEditor.mockReturnValue({
            action: mockAction,
        });
    });

    it('executes toggleStrongCommand when Bold button is clicked', () => {
        render(<Toolbar onSave={() => { }} onOpen={() => { }} />);

        const boldBtn = screen.getByTitle('Bold');
        // Using onMouseDown because the implementation uses onMouseDown to preventDefault
        fireEvent.mouseDown(boldBtn);

        expect(mockGetEditor).toHaveBeenCalled();
        expect(callCommand).toHaveBeenCalledWith(toggleStrongCommand.key, undefined);
        expect(mockAction).toHaveBeenCalled();
    });

    it('executes toggleEmphasisCommand when Italic button is clicked', () => {
        render(<Toolbar onSave={() => { }} onOpen={() => { }} />);
        const italicBtn = screen.getByTitle('Italic');
        fireEvent.mouseDown(italicBtn);
        expect(callCommand).toHaveBeenCalledWith(toggleEmphasisCommand.key, undefined);
    });

    it('executes wrapInHeadingCommand when Heading button is clicked', () => {
        render(<Toolbar onSave={() => { }} onOpen={() => { }} />);
        const h1Btn = screen.getByTitle('Heading 1');
        fireEvent.mouseDown(h1Btn);
        expect(callCommand).toHaveBeenCalledWith(wrapInHeadingCommand.key, 1);
    });
});
