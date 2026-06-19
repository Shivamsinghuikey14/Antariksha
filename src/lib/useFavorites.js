import { useEffect, useState, useCallback } from 'react';

const KEY = 'aether.favorites';

function read() {
  if (typeof localStorage === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

function write(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

/**
 * useFavorites — localStorage-backed bookmarks. No backend required.
 * Stores an array of {path, label, savedAt} objects.
 */
export function useFavorites() {
  const [list, setList] = useState(read);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY) setList(read()); };
    addEventListener('storage', onStorage);
    return () => removeEventListener('storage', onStorage);
  }, []);

  const has = useCallback((path) => list.some(f => f.path === path), [list]);

  const toggle = useCallback((path, label) => {
    setList(prev => {
      const exists = prev.find(f => f.path === path);
      const next = exists
        ? prev.filter(f => f.path !== path)
        : [...prev, { path, label, savedAt: Date.now() }];
      write(next);
      return next;
    });
  }, []);

  const remove = useCallback((path) => {
    setList(prev => { const next = prev.filter(f => f.path !== path); write(next); return next; });
  }, []);

  const clear = useCallback(() => { setList([]); write([]); }, []);

  return { list, has, toggle, remove, clear };
}
