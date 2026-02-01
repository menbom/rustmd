import { useRef, useState, useEffect } from 'react';
import { open as openDialog, save as saveDialog } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { EditorWrapper, EditorRef } from './components/Editor';
import { TitleBar } from './components/TitleBar';
import { ResizableLayout } from './components/ResizableLayout';
import { FolderOpen, Save, FilePlus } from 'lucide-react';
import { isTauri } from './utils/platform';

function App() {
  const editorRef = useRef<EditorRef>(null);
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          handleSave();
        } else if (e.key === 'o') {
          e.preventDefault();
          handleOpen();
        } else if (e.key === 'n') {
          e.preventDefault();
          handleNew();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPath]); // Dependency on currentPath needed if handleSave uses it closure-captured. No, handleSave uses ref/state? 
  // handleSave reads currentPath from closure. So dependency on currentPath is required.


  const handleOpen = async () => {
    if (!isTauri()) {
      alert("File system access is not available in the browser.");
      return;
    }
    try {
      const path = await openDialog({
        multiple: false,
        directory: false,
      });

      if (path === null) return;

      const content = await readTextFile(path);
      console.log("App: Read file content length:", content.length);
      editorRef.current?.setMarkdown(content);
      setCurrentPath(path);
    } catch (e) {
      console.error("Failed to open file:", e);
      alert("Failed to open file: " + e);
    }
  };

  const handleSave = async () => {
    if (!isTauri()) {
      alert("File system access is not available in the browser.");
      return;
    }
    if (!currentPath) {
      const path = await saveDialog({
        filters: [{
          name: 'Markdown',
          extensions: ['md', 'markdown']
        }]
      });
      if (!path) return;
      setCurrentPath(path);
      // proceed to save
      await saveContent(path);
    } else {
      await saveContent(currentPath);
    }
  };

  const saveContent = async (path: string) => {
    try {
      const content = await editorRef.current?.getMarkdown();
      if (content === undefined) return;
      if (isTauri()) {
        await writeTextFile(path, content);
      } else {
        console.log("Browser mode: Saving content to console", content);
      }
      alert("Saved!");
    } catch (e) {
      console.error("Failed to save:", e);
      alert("Failed to save: " + e);
    }
  };

  const handleNew = () => {
    if (confirm("Create new file? Unsaved changes will be lost.")) {
      editorRef.current?.setMarkdown("");
      setCurrentPath(null);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <TitleBar />
      <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 bg-white dark:bg-gray-900 justify-between">
        <div className="flex items-center space-x-2">
          {/* App Name moved to TitleBar, keeping just file info here or removing redundancy */}
          {currentPath ? (
            <span className="text-xs text-gray-500 font-mono">{currentPath}</span>
          ) : (
            <span className="text-sm text-gray-400 font-medium select-none">Untitled</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleNew} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300" title="New">
            <FilePlus size={20} />
          </button>
          <button onClick={handleOpen} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300" title="Open">
            <FolderOpen size={20} />
          </button>
          <button onClick={handleSave} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300" title="Save">
            <Save size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden h-full">
        <ResizableLayout
          left={<EditorWrapper ref={editorRef} onSave={handleSave} onOpen={handleOpen} />}
        />
      </div>
    </div>
  );
}

export default App;
