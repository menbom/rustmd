import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export const TitleBar = () => {
    const [isMaximized, setIsMaximized] = useState(false);
    const appWindow = getCurrentWindow();

    useEffect(() => {
        const updateState = async () => {
            setIsMaximized(await appWindow.isMaximized());
        };
        updateState();

        const unlisten = appWindow.listen('tauri://resize', updateState);
        return () => {
            unlisten.then(f => f());
        };
    }, []);

    const minimize = () => appWindow.minimize();
    const toggleMaximize = async () => {
        await appWindow.toggleMaximize();
        setIsMaximized(await appWindow.isMaximized());
    };
    const close = () => appWindow.close();

    return (
        <div className="h-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between select-none w-full shrink-0 z-50">
            {/* Left side: App Name + Drag Region */}
            <div className="flex items-center flex-1 h-full min-w-0">
                <div className="flex items-center space-x-2 px-3 pointer-events-none">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">RustMD</span>
                </div>
                {/* Drag spacer fills remaining space - Manual Handler */}
                <div
                    onMouseDown={() => appWindow.startDragging()}
                    className="flex-1 h-full cursor-default"
                />
            </div>

            {/* Right side: Window Controls (NO drag region) */}
            <div className="flex items-center space-x-1 px-3">
                <button
                    onClick={minimize}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 transition-colors cursor-default"
                    title="Minimize"
                >
                    <Minus size={14} />
                </button>
                <button
                    onClick={toggleMaximize}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 transition-colors cursor-default"
                    title={isMaximized ? "Restore" : "Maximize"}
                >
                    <Square size={12} />
                </button>
                <button
                    onClick={close}
                    className="p-1.5 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 rounded text-gray-500 dark:text-gray-400 transition-colors cursor-default"
                    title="Close"
                >
                    <X size={14} />
                </button>
            </div>
        </div >
    );
};
