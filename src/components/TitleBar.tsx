import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isTauri } from '../utils/platform';

export const TitleBar = () => {
    const [isMaximized, setIsMaximized] = useState(false);

    if (!isTauri()) {
        return null;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const appWindow = getCurrentWindow();

    // eslint-disable-next-line react-hooks/rules-of-hooks
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
        <div className="h-10 bg-industrial-surface border-b border-industrial-base flex items-center justify-between select-none w-full shrink-0 z-50 shadow-sm relative overflow-hidden">
            {/* Design Element: Top Highlight */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5 pointer-events-none" />

            {/* Left side: App Name + Drag Region */}
            <div className="flex items-center flex-1 h-full min-w-0">
                <div className="flex items-center space-x-2 px-4 pointer-events-none border-r border-industrial-base h-full bg-industrial-surface z-10">
                    <div className="w-2 h-2 bg-industrial-amber rotate-45" /> {/* Accent Diamond */}
                    <span className="text-sm font-display font-bold tracking-wider text-gray-200 uppercase">RustMD</span>
                </div>
                {/* Drag spacer fills remaining space - Manual Handler */}
                <div
                    onMouseDown={() => appWindow.startDragging()}
                    className="flex-1 h-full cursor-default hover:bg-white/5 transition-colors"
                />
            </div>

            {/* Right side: Window Controls (NO drag region) */}
            <div className="flex items-center h-full">
                <button
                    onClick={minimize}
                    className="h-full px-4 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-default flex items-center justify-center border-l border-industrial-base"
                    title="Minimize"
                >
                    <Minus size={16} />
                </button>
                <button
                    onClick={toggleMaximize}
                    className="h-full px-4 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-default flex items-center justify-center border-l border-industrial-base"
                    title={isMaximized ? "Restore" : "Maximize"}
                >
                    <Square size={14} />
                </button>
                <button
                    onClick={close}
                    className="h-full px-4 hover:bg-red-500/80 hover:text-white text-gray-400 transition-colors cursor-default flex items-center justify-center border-l border-industrial-base group"
                    title="Close"
                >
                    <X size={16} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div >
    );
};
