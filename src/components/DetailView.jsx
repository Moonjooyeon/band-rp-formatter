import { useState, useMemo, useEffect } from 'react';
import DmPreview from './DmPreview.jsx';
import PostPreview from './PostPreview.jsx';
import { colorForTag } from '../lib/colors.js';
import { collectSessionParticipants, updateSession } from '../lib/library.js';

export default function DetailView({ session, onBack }) {
  const data = session.data;
  const tagColor = colorForTag(session.tag || session.kind || 'default');

  // 등장 캐릭터 목록 + 글 작성자 우선
  const characters = useMemo(() => {
    const set = collectSessionParticipants(session);
    const arr = Array.from(set);
    // 글 작성자가 있으면 맨 앞으로
    if (data?.kind === 'post' && data.meta.author) {
      const author = data.meta.author;
      return [author, ...arr.filter(c => c !== author)];
    }
    return arr;
  }, [session, data]);

  // 내 캐릭터 (세션에 저장됨)
  const [myCharacter, setMyCharacter] = useState(session.myCharacter || '');

  // 변경 시 세션에 자동 저장
  useEffect(() => {
    if (myCharacter !== (session.myCharacter || '')) {
      updateSession(session.id, { myCharacter });
    }
  }, [myCharacter, session.id, session.myCharacter]);

  return (
    <div className="bg-white min-h-screen">
      {/* 헤더 */}
      <header className="border-b border-lavender-100 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 flex-wrap">
          <button
            onClick={onBack}
            className="text-sm text-whisper hover:text-ink flex items-center gap-1 transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            <span>라이브러리</span>
          </button>
          <div className="h-4 w-px bg-lavender-100" />
          {session.tag && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold text-white tracking-wide"
              style={{ backgroundColor: tagColor }}
            >
              {session.tag}
            </span>
          )}
          <h1 className="font-bold text-ink truncate flex-1 text-sm sm:text-base min-w-0">
            {session.title}
          </h1>

          {/* 내 캐릭터 셀렉터 (게시글에서) */}
          {data.kind === 'post' && characters.length > 0 && (
            <CharacterSelector
              characters={characters}
              value={myCharacter}
              onChange={setMyCharacter}
            />
          )}
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* 세션 메타 */}
        {(session.description || session.gm || session.pcs?.length || session.date) && (
          <div className="mb-10 pb-8 border-b border-lavender-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3 leading-tight">
              {session.title}
            </h2>
            {session.description && (
              <p className="text-[14px] text-whisper leading-relaxed mb-5">
                {session.description}
              </p>
            )}
            <dl className="flex flex-wrap gap-x-6 gap-y-1.5 text-[11.5px]">
              {session.gm && <MetaItem label="GM" value={session.gm} />}
              {session.pcs?.length > 0 && <MetaItem label="PC" value={session.pcs.join(', ')} />}
              {session.date && <MetaItem label="날짜" value={session.dateEnd && session.dateEnd !== session.date ? `${session.date} ~ ${session.dateEnd}` : session.date} />}
              {data.meta.filterApplied && <MetaItem label="필터" value={data.meta.filterApplied.join(', ')} />}
            </dl>
          </div>
        )}

        {/* 액션 바 (향후) */}
        <div className="flex justify-end gap-2 mb-8">
          <button disabled className="px-3 py-1.5 text-[11px] border border-lavender-100 rounded-md text-whisper cursor-not-allowed opacity-50" title="다음 버전에서 제공">
            ✨ AI 정돈
          </button>
          <button disabled className="px-3 py-1.5 text-[11px] border border-lavender-100 rounded-md text-whisper cursor-not-allowed opacity-50" title="다음 버전에서 제공">
            📄 PDF/JPG
          </button>
        </div>

        {/* 백업 본문 미리보기 */}
        {data.kind === 'dm' ? <DmPreview data={data} /> : <PostPreview data={data} myCharacter={myCharacter} />}
      </main>
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div className="flex gap-2">
      <dt className="text-whisper font-semibold uppercase tracking-wider">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

function CharacterSelector({ characters, value, onChange }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] bg-lavender-50 px-2.5 py-1 rounded-full">
      <span className="text-whisper">🎭 시점</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-transparent text-ink font-medium focus:outline-none cursor-pointer max-w-[140px]"
      >
        <option value="">전체 보기</option>
        {characters.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
