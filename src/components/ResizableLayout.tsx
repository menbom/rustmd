import { ReactNode } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';

interface ResizableLayoutProps {
    left: ReactNode;
    right?: ReactNode;
}

export function ResizableLayout({ left, right }: ResizableLayoutProps) {
    if (!right) {
        return (
            <div className="h-full w-full bg-industrial-base text-gray-100 font-body overflow-hidden">
                <div className="h-full w-full overflow-hidden flex flex-col bg-industrial-surface">
                    {left}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-industrial-base text-gray-100 font-body overflow-hidden">
            <Group orientation="horizontal">
                <Panel defaultSize={50} minSize={20} className="bg-industrial-surface">
                    <div className="h-full w-full overflow-hidden flex flex-col">
                        {left}
                    </div>
                </Panel>
                <Separator className="w-1 bg-industrial-base hover:bg-industrial-amber transition-colors duration-200 flex items-center justify-center">
                    <div className="h-8 w-1 bg-gray-600 rounded-full" />
                </Separator>
                <Panel className="bg-industrial-base">
                    <div className="h-full w-full overflow-hidden flex flex-col">
                        {right}
                    </div>
                </Panel>
            </Group>
        </div>
    );
}
