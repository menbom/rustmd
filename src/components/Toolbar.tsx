import { useInstance } from '@milkdown/react';
import { callCommand } from '@milkdown/utils';
import {
    toggleStrongCommand,
    toggleEmphasisCommand,
    wrapInHeadingCommand,
    wrapInBulletListCommand,
    wrapInOrderedListCommand
} from '@milkdown/preset-commonmark';
import { insertTableCommand } from '@milkdown/preset-gfm';
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Table,
    FolderOpen,
    Save
} from 'lucide-react';

interface ToolbarProps {
    onSave: () => void;
    onOpen: () => void;
}

const ToolbarButton = ({ onClick, icon: Icon, label }: { onClick: () => void, icon: any, label: string }) => (
    <button
        type="button"
        onMouseDown={(e) => {
            e.preventDefault();
            onClick();
        }}
        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
        title={label}
        aria-label={label}
    >
        <Icon className="w-5 h-5" />
    </button>
);

export const Toolbar = ({ onSave, onOpen }: ToolbarProps) => {
    const [loading, getEditor] = useInstance();

    const runCommand = <T,>(command: any, payload?: T) => {
        if (loading) return;
        const editor = getEditor();
        if (!editor) return;

        editor.action(callCommand(command, payload));
    };

    return (
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10 overflow-x-auto">
            <ToolbarButton
                onClick={() => runCommand(toggleStrongCommand)}
                icon={Bold}
                label="Bold"
            />
            <ToolbarButton
                onClick={() => runCommand(toggleEmphasisCommand)}
                icon={Italic}
                label="Italic"
            />
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            <ToolbarButton
                onClick={() => runCommand(wrapInHeadingCommand, 1)}
                icon={Heading1}
                label="Heading 1"
            />
            <ToolbarButton
                onClick={() => runCommand(wrapInHeadingCommand, 2)}
                icon={Heading2}
                label="Heading 2"
            />
            <ToolbarButton
                onClick={() => runCommand(wrapInHeadingCommand, 3)}
                icon={Heading3}
                label="Heading 3"
            />
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            <ToolbarButton
                onClick={() => runCommand(wrapInBulletListCommand)}
                icon={List}
                label="Bullet List"
            />
            <ToolbarButton
                onClick={() => runCommand(wrapInOrderedListCommand)}
                icon={ListOrdered}
                label="Ordered List"
            />
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            <ToolbarButton
                onClick={() => runCommand(insertTableCommand)}
                icon={Table}
                label="Insert Table"
            />
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            <ToolbarButton
                onClick={onOpen}
                icon={FolderOpen}
                label="Open File"
            />
            <ToolbarButton
                onClick={onSave}
                icon={Save}
                label="Save File"
            />
        </div>
    );
};
