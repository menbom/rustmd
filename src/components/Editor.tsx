import { useImperativeHandle, forwardRef, useState, useRef } from 'react';
import { Toolbar } from './Toolbar';
import './Editor.css';
import { Editor, rootCtx, defaultValueCtx, editorViewCtx, serializerCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { prism, prismConfig } from '@milkdown/plugin-prism';
// @ts-ignore
import markdown from 'refractor/markdown';
// @ts-ignore
import javascript from 'refractor/javascript';
// @ts-ignore
import typescript from 'refractor/typescript';
// @ts-ignore
import css from 'refractor/css';
// @ts-ignore
import rust from 'refractor/rust';
// @ts-ignore
import html from 'refractor/markup';
// @ts-ignore
import json from 'refractor/json';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';

export interface EditorRef {
    getMarkdown: () => Promise<string>;
    setMarkdown: (markdown: string) => void;
}

interface EditorInnerProps {
    markdown: string;
    onEditorReady: (editor: Editor) => void;
}

// Inner component that mounts the editor
const EditorInner = ({ markdown: markdownContent, onEditorReady }: EditorInnerProps) => {
    useEditor((root) => {
        const editor = Editor.make()
            .config((ctx) => {
                ctx.set(rootCtx, root);
                ctx.set(defaultValueCtx, markdownContent);
                ctx.set(prismConfig.key, {
                    configureRefractor: (refractor) => {
                        refractor.register(markdown);
                        refractor.register(javascript);
                        refractor.register(typescript);
                        refractor.register(css);
                        refractor.register(rust);
                        refractor.register(html);
                        refractor.register(json);
                    },
                });
            })
            .config(nord)
            .use(commonmark)
            .use(gfm)
            .use(prism);

        onEditorReady(editor);
        return editor;
    }, [markdownContent]); // Re-run if markdown changes (though we rely on key for full reset)

    return <Milkdown />;
};

interface EditorWrapperProps {
    onSave: () => void;
    onOpen: () => void;
}

export const EditorWrapper = forwardRef<EditorRef, EditorWrapperProps>(({ onSave, onOpen }, ref) => {
    const [content, setContent] = useState('# Welcome to RustMD\n\nStart typing or open a file...');
    const [editorKey, setEditorKey] = useState(0);
    const editorInstance = useRef<Editor | null>(null);

    useImperativeHandle(ref, () => ({
        getMarkdown: () => {
            if (!editorInstance.current) return Promise.resolve("");
            return new Promise((resolve) => {
                editorInstance.current!.action((ctx: any) => {
                    const view = ctx.get(editorViewCtx);
                    const serializer = ctx.get(serializerCtx);
                    const markdown = serializer(view.state.doc);
                    resolve(markdown);
                });
            });
        },
        setMarkdown: (markdown: string) => {
            // Update content and force re-mount by changing key
            setContent(markdown);
            setEditorKey(prev => prev + 1);
        }
    }));

    return (
        <MilkdownProvider key={editorKey}>
            <div className="h-full w-full overflow-hidden p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col">
                <div className="max-w-4xl mx-auto w-full h-full flex flex-col shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <Toolbar onSave={onSave} onOpen={onOpen} />
                    <div className="milkdown flex-1 overflow-y-auto p-8">
                        <EditorInner
                            markdown={content}
                            onEditorReady={(editor) => {
                                editorInstance.current = editor;
                            }}
                        />
                    </div>
                </div>
            </div>
        </MilkdownProvider>
    );
});
