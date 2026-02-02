import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Toolbar } from '../Toolbar';
import {
    toggleStrongCommand,
    toggleEmphasisCommand,
    wrapInHeadingCommand,
    wrapInBulletListCommand,
    wrapInOrderedListCommand
} from '@milkdown/preset-commonmark';
import { insertTableCommand } from '@milkdown/preset-gfm';
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

vi.mock('@milkdown/preset-commonmark', () => ({
    toggleStrongCommand: { key: 'toggleStrongCommand' },
    toggleEmphasisCommand: { key: 'toggleEmphasisCommand' },
    wrapInHeadingCommand: { key: 'wrapInHeadingCommand' },
    wrapInBulletListCommand: { key: 'wrapInBulletListCommand' },
    wrapInOrderedListCommand: { key: 'wrapInOrderedListCommand' },
}));

vi.mock('@milkdown/preset-gfm', () => ({
    insertTableCommand: { key: 'insertTableCommand' },
}));

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

    it('executes wrapInHeadingCommand (level 2) when Heading 2 button is clicked', () => {
        render(<Toolbar onSave={() => { }} onOpen={() => { }} />);
        const h2Btn = screen.getByTitle('Heading 2');
        fireEvent.mouseDown(h2Btn);
        expect(callCommand).toHaveBeenCalledWith(wrapInHeadingCommand.key, 2);
    });

    it('executes wrapInHeadingCommand (level 3) when Heading 3 button is clicked', () => {
        render(<Toolbar onSave={() => { }} onOpen={() => { }} />);
        const h3Btn = screen.getByTitle('Heading 3');
        fireEvent.mouseDown(h3Btn);
        expect(callCommand).toHaveBeenCalledWith(wrapInHeadingCommand.key, 3);
    });

    it('executes wrapInBulletListCommand when Bullet List button is clicked', () => {
        render(<Toolbar onSave={() => { }} onOpen={() => { }} />);
        const listBtn = screen.getByTitle('Bullet List');
        fireEvent.mouseDown(listBtn);
        expect(callCommand).toHaveBeenCalledWith(wrapInBulletListCommand.key, undefined);
    });

    it('executes wrapInOrderedListCommand when Ordered List button is clicked', () => {
        render(<Toolbar onSave={() => { }} onOpen={() => { }} />);
        const listBtn = screen.getByTitle('Ordered List');
        fireEvent.mouseDown(listBtn);
        expect(callCommand).toHaveBeenCalledWith(wrapInOrderedListCommand.key, undefined);
    });

    it('executes insertTableCommand when Insert Table button is clicked', () => {
        render(<Toolbar onSave={() => { }} onOpen={() => { }} />);
        const tableBtn = screen.getByTitle('Insert Table');
        fireEvent.mouseDown(tableBtn);
        expect(callCommand).toHaveBeenCalledWith(insertTableCommand.key, undefined);
    });

    it('calls onOpen when Open File button is clicked', () => {
        const onOpen = vi.fn();
        render(<Toolbar onSave={() => { }} onOpen={onOpen} />);
        const openBtn = screen.getByTitle('Open File');
        fireEvent.mouseDown(openBtn);
        expect(onOpen).toHaveBeenCalled();
    });

    it('calls onSave when Save File button is clicked', () => {
        const onSave = vi.fn();
        render(<Toolbar onSave={onSave} onOpen={() => { }} />);
        const saveBtn = screen.getByTitle('Save File');
        fireEvent.mouseDown(saveBtn);
        expect(onSave).toHaveBeenCalled();
    });
});
