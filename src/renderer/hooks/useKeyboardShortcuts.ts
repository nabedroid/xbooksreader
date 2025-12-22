/**
 * キーボードショートカットフック
 */
import { useEffect } from 'react';

interface ShortcutHandlers {
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onPrevPage10?: () => void;
  onNextPage10?: () => void;
  onPrevPage100?: () => void;
  onNextPage100?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onToggleFullscreen?: () => void;
  onAddBookmark?: () => void;
  onNewTab?: () => void;
  onCloseTab?: () => void;
  onSearch?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd キーの組み合わせ
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 't':
            e.preventDefault();
            handlers.onNewTab?.();
            break;
          case 'w':
            e.preventDefault();
            handlers.onCloseTab?.();
            break;
          case 'f':
            e.preventDefault();
            handlers.onSearch?.();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            handlers.onPrevPage100?.();
            break;
          case 'ArrowRight':
            e.preventDefault();
            handlers.onNextPage100?.();
            break;
        }
        return;
      }

      // Shift キーの組み合わせ
      if (e.shiftKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            handlers.onPrevPage10?.();
            break;
          case 'ArrowRight':
            e.preventDefault();
            handlers.onNextPage10?.();
            break;
        }
        return;
      }

      // 単独キー
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlers.onPrevPage?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlers.onNextPage?.();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handlers.onZoomIn?.();
          break;
        case '-':
          e.preventDefault();
          handlers.onZoomOut?.();
          break;
        case '0':
          e.preventDefault();
          handlers.onZoomReset?.();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handlers.onToggleFullscreen?.();
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          handlers.onAddBookmark?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
