import { useState, useRef, useEffect } from 'react';
import { parseBackup } from '../lib/parser.js';

export default function AddSession({ onCancel, onSave, initialData = null }) {
  const [stage, setStage] = useState(initialData ? 'form' : 'upload');
  const [parsed, setParsed] = useState(initialData);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState({
    title: '', tag: '', description: '', gm: '', pcs: '', date: '', dateEnd: '', cover: ''
  });
  const fileRef = useRef(null);
  const coverRef = useRef(null);

  // initialData가 있으면 자동 채우기
  useEffect(() => {
    if (initialData) {
      setMeta(m => ({
        ...m,
        date: m.date || extractDate(initialData),
        pcs: m.pcs || extractPcs(initialData),
        gm: m.gm || extractGm(initialData),
      }));
    }
  }, [initialData]);

  async function handleFile(file) {
    setError('');
    try {
      const text = await file.text();
      const obj = JSON.parse(text);
      const p = parseBackup(obj);
      setParsed(p);
      // 자동 채우기
      setMeta(m => ({
        ...m,
        date: m.date || extractDate(p),
        pcs: m.pcs || extractPcs(p),
        gm: m.gm || extractGm(p),
      }));
      setStage('form');
    } catch (e) {
      setError('파일을 읽을 수 없어요: ' + e.message);
    }
  }

  async function handleCover(file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('표지 이미지는 2MB 이하여야 해요.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setMeta(m => ({ ...m, cover: reader.result }));
    reader.readAsDataURL(file);
  }

  function submit() {
    if (!meta.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    onSave({
      ...meta,
      pcs: meta.pcs.split(',').map(s => s.trim()).filter(Boolean),
      kind: parsed.kind,
      data: parsed, // 원본 백업 데이터 전체 보관
    });
  }

  if (stage === 'upload') {
    return (
      <Frame title="새 세션 추가" subtitle="1 / 2 — 백업 파일 가져오기" onCancel={onCancel}>
        <div
          className="border-2 border-dashed border-lavender-200 rounded-2xl p-12 text-center bg-white/50 cursor-pointer hover:bg-white/70 transition"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          <div className="text-4xl text-lavender-300 mb-3">⌬</div>
          <p className="text-ink font-medium mb-1">JSON 파일을 끌어다 놓거나 클릭</p>
          <p className="text-xs text-whisper">확장프로그램에서 추출한 .json 파일</p>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
          />
        </div>
        {error && <ErrorBox>{error}</ErrorBox>}
      </Frame>
    );
  }

  return (
    <Frame title="세션 정보" subtitle="2 / 2 — 표지와 기본 정보를 입력해주세요" onCancel={onCancel}>
      <div className="grid sm:grid-cols-[200px_1fr] gap-5">
        {/* 표지 업로더 */}
        <div>
          <Label>표지</Label>
          <div
            className="aspect-[4/3] rounded-xl bg-lavender-100 overflow-hidden cursor-pointer hover:opacity-90 relative"
            onClick={() => coverRef.current?.click()}
          >
            {meta.cover ? (
              <img src={meta.cover} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-whisper text-xs">
                <span className="text-3xl mb-1">+</span>
                <span>이미지 업로드</span>
              </div>
            )}
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleCover(e.target.files[0])}
            />
          </div>
          {meta.cover && (
            <button
              onClick={() => setMeta(m => ({ ...m, cover: '' }))}
              className="text-xs text-whisper mt-1 hover:text-tagRed"
            >
              표지 제거
            </button>
          )}
        </div>

        {/* 메타 폼 */}
        <div className="space-y-3">
          <Field label="장르 / 태그" help="예: CoC, 로판, 일상">
            <input
              type="text"
              value={meta.tag}
              onChange={e => setMeta(m => ({ ...m, tag: e.target.value }))}
              className="w-full px-3 py-2 border border-lavender-100 rounded-md bg-white"
              placeholder="카테고리"
            />
          </Field>
          <Field label="제목 *">
            <input
              type="text"
              value={meta.title}
              onChange={e => setMeta(m => ({ ...m, title: e.target.value }))}
              className="w-full px-3 py-2 border border-lavender-100 rounded-md bg-white"
              placeholder="이 세션의 제목을 입력하세요"
            />
          </Field>
          <Field label="설명">
            <textarea
              value={meta.description}
              onChange={e => setMeta(m => ({ ...m, description: e.target.value }))}
              className="w-full h-20 px-3 py-2 border border-lavender-100 rounded-md bg-white text-sm resize-none"
              placeholder="시놉시스 또는 한 줄 요약"
            />
          </Field>
          <Field label="GM">
            <input
              type="text"
              value={meta.gm}
              onChange={e => setMeta(m => ({ ...m, gm: e.target.value }))}
              className="w-full px-3 py-2 border border-lavender-100 rounded-md bg-white"
            />
          </Field>
          <Field label="PC" help="쉼표로 구분">
            <input
              type="text"
              value={meta.pcs}
              onChange={e => setMeta(m => ({ ...m, pcs: e.target.value }))}
              className="w-full px-3 py-2 border border-lavender-100 rounded-md bg-white"
              placeholder="등장 캐릭터들"
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="시작 날짜">
              <input
                type="date"
                value={meta.date}
                onChange={e => setMeta(m => ({ ...m, date: e.target.value }))}
                className="w-full px-3 py-2 border border-lavender-100 rounded-md bg-white"
              />
            </Field>
            <Field label="종료 날짜">
              <input
                type="date"
                value={meta.dateEnd}
                onChange={e => setMeta(m => ({ ...m, dateEnd: e.target.value }))}
                className="w-full px-3 py-2 border border-lavender-100 rounded-md bg-white"
              />
            </Field>
          </div>
        </div>
      </div>

      {error && <ErrorBox>{error}</ErrorBox>}

      <div className="flex justify-end gap-2 mt-6 pt-5 border-t border-lavender-100">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-whisper hover:text-ink">
          취소
        </button>
        <button onClick={submit} className="px-5 py-2 bg-ink text-white rounded-md text-sm font-semibold hover:bg-lavender-700 transition">
          라이브러리에 추가
        </button>
      </div>
    </Frame>
  );
}

function Frame({ title, subtitle, onCancel, children }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 relative">
      <div className="bg-card rounded-3xl shadow-card p-6 sm:p-8">
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-lavender-100">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">{title}</h2>
            <p className="text-xs text-whisper mt-1">{subtitle}</p>
          </div>
          <button onClick={onCancel} className="text-whisper hover:text-ink text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-xs font-medium text-whisper mb-1.5">{children}</label>;
}

function Field({ label, help, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <Label>{label}</Label>
        {help && <span className="text-[10px] text-whisper">{help}</span>}
      </div>
      {children}
    </div>
  );
}

function ErrorBox({ children }) {
  return (
    <div className="mt-4 p-3 bg-tagRed/10 border-l-2 border-tagRed text-sm text-ink rounded">
      {children}
    </div>
  );
}

function extractDate(parsed) {
  if (parsed.kind === 'post' && parsed.meta.postTime) {
    // "2026년 6월 14일 오후 8:30" → "2026-06-14"
    const m = parsed.meta.postTime.match(/(\d{4})[년.\-\s]+(\d{1,2})[월.\-\s]+(\d{1,2})/);
    if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  }
  if (parsed.meta.extractedAt) {
    return parsed.meta.extractedAt.slice(0, 10);
  }
  return '';
}

function extractGm(parsed) {
  if (parsed.kind === 'post' && parsed.meta?.author) {
    return parsed.meta.author;
  }
  if (parsed.kind === 'dm') {
    // DM에서는 "나(me)"의 이름
    const meMsg = parsed.messages?.find(m => m.type === 'me');
    if (meMsg?.name) return meMsg.name;
  }
  return '';
}

function extractPcs(parsed) {
  // 필터가 적용된 경우: 필터 선택자 + 글 작성자만
  if (parsed.kind === 'post' && parsed.meta?.filterApplied?.length > 0) {
    const set = new Set(parsed.meta.filterApplied);
    if (parsed.meta.author) set.add(parsed.meta.author);
    return Array.from(set).join(', ');
  }

  // 필터 없음: 모든 작성자 (_filteredOut placeholder 제외)
  const set = new Set();
  if (parsed.kind === 'dm') {
    parsed.messages.forEach(m => {
      if (m.name && (m.type === 'me' || m.type === 'friend')) set.add(m.name);
    });
  } else if (parsed.kind === 'post') {
    if (parsed.meta?.author) set.add(parsed.meta.author);
    const walk = (cs) => {
      cs.forEach(c => {
        // placeholder는 이름 제외, 답글은 재귀
        if (!c._filteredOut && c.name) set.add(c.name);
        if (c.replies) walk(c.replies);
      });
    };
    walk(parsed.comments);
  }
  return Array.from(set).join(', ');
}
