// 세션 라이브러리 - localStorage 영속화

const KEY = 'band-rp-library:v1';

export function loadLibrary() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLibrary(sessions) {
  try {
    localStorage.setItem(KEY, JSON.stringify(sessions));
    return true;
  } catch (e) {
    // QuotaExceededError 등
    console.error('라이브러리 저장 실패:', e);
    return false;
  }
}

export function addSession(session) {
  const lib = loadLibrary();
  const next = [{ ...session, id: session.id || cryptoId(), createdAt: Date.now() }, ...lib];
  saveLibrary(next);
  return next;
}

export function updateSession(id, patch) {
  const lib = loadLibrary();
  const next = lib.map(s => s.id === id ? { ...s, ...patch } : s);
  saveLibrary(next);
  return next;
}

export function removeSession(id) {
  const lib = loadLibrary();
  const next = lib.filter(s => s.id !== id);
  saveLibrary(next);
  return next;
}

function cryptoId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
}
