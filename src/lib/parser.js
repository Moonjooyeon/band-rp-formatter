// 확장에서 추출한 JSON을 내부 표현으로 정규화

export function parseBackup(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('JSON 형식이 아닙니다.');
  }

  // DM: messages 배열 존재
  if (Array.isArray(raw.messages)) {
    return {
      kind: 'dm',
      meta: {
        extractedAt: raw.extractedAt || null,
        messageCount: raw.messageCount ?? raw.messages.length,
      },
      messages: raw.messages,
    };
  }

  // 게시글: body + comments
  if (typeof raw.body === 'string' && Array.isArray(raw.comments)) {
    return {
      kind: 'post',
      meta: {
        extractedAt: raw.extractedAt || null,
        author: raw.author || '',
        postTime: raw.postTime || '',
        commentCount: raw.commentCount ?? countAll(raw.comments),
        filterApplied: raw.filterApplied || null,
      },
      body: raw.body,
      comments: raw.comments,
    };
  }

  throw new Error('지원하지 않는 JSON 구조입니다. (DM 또는 게시글 백업 JSON이어야 합니다)');
}

function countAll(comments) {
  let n = 0;
  for (const c of comments) {
    n++;
    n += countAll(c.replies || []);
  }
  return n;
}

// 게시글에서 작성자 목록 추출 (필터/색상 매핑용)
export function collectAuthors(parsed) {
  const map = new Map();
  if (parsed.kind === 'dm') {
    for (const m of parsed.messages) {
      if (m.type === 'me' || m.type === 'friend') {
        const key = m.name || (m.type === 'me' ? '(나)' : '(상대)');
        map.set(key, (map.get(key) || 0) + 1);
      }
    }
  } else if (parsed.kind === 'post') {
    walk(parsed.comments, map);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function walk(comments, map) {
  for (const c of comments) {
    if (c.name) map.set(c.name, (map.get(c.name) || 0) + 1);
    walk(c.replies || [], map);
  }
}
