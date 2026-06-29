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

// 모든 세션에서 등장하는 캐릭터/작성자 추출 → 빈도순 정렬
export function buildCharacterIndex(sessions) {
  const map = new Map();
  for (const s of sessions) {
    const names = collectSessionParticipants(s);
    for (const name of names) {
      if (!map.has(name)) map.set(name, { name, sessions: [], sessionCount: 0, lastSeen: 0 });
      const entry = map.get(name);
      if (!entry.sessions.find(x => x.id === s.id)) {
        entry.sessions.push(s);
        entry.sessionCount++;
        if ((s.createdAt || 0) > entry.lastSeen) entry.lastSeen = s.createdAt || 0;
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.sessionCount - a.sessionCount || b.lastSeen - a.lastSeen);
}

// 한 세션의 등장 캐릭터/작성자 모음 (메타 PC + 실제 데이터, _filteredOut 제외)
export function collectSessionParticipants(session) {
  const set = new Set();
  if (session.pcs) session.pcs.forEach(p => p && set.add(p));
  if (session.data) {
    if (session.data.kind === 'dm') {
      session.data.messages.forEach(m => {
        if (m.name && (m.type === 'me' || m.type === 'friend')) set.add(m.name);
      });
    } else if (session.data.kind === 'post') {
      if (session.data.meta.author) set.add(session.data.meta.author);
      const walk = cs => cs.forEach(c => {
        // placeholder는 이름 제외, 답글은 재귀
        if (!c._filteredOut && c.name) set.add(c.name);
        if (c.replies) walk(c.replies);
      });
      walk(session.data.comments);
    }
  }
  return set;
}

function cryptoId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
}
