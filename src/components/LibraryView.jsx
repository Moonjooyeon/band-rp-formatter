import { useState, useMemo } from 'react';
import SessionCard from './SessionCard.jsx';
import CharacterCard from './CharacterCard.jsx';
import { buildCharacterIndex } from '../lib/library.js';

export default function LibraryView({
  sessions,
  onOpenSession,
  onOpenCharacter,
  onAddNew,
  onEdit,
  onDelete,
}) {
  const [mode, setMode] = useState('sessions'); // 'sessions' | 'characters'

  const characters = useMemo(
    () => mode === 'characters' ? buildCharacterIndex(sessions) : [],
    [sessions, mode]
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
      {/* 브랜드 */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-semibold mb-1">
          Communal Backup
        </div>
        <h1 className="font-bold text-white text-2xl sm:text-3xl tracking-tight">
          커뮤 백업
        </h1>
      </div>

      {/* 모드 토글 + 추가 버튼 */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur p-1 rounded-full">
          <TabBtn active={mode === 'sessions'} onClick={() => setMode('sessions')}>
            📖 세션
          </TabBtn>
          <TabBtn active={mode === 'characters'} onClick={() => setMode('characters')}>
            🎭 자캐
          </TabBtn>
        </div>
        <button
          onClick={onAddNew}
          className="px-4 py-2.5 bg-white text-ink rounded-full text-sm font-semibold shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all flex items-center gap-1.5"
        >
          <span className="text-lavender-600">＋</span>
          새 세션 추가
        </button>
      </div>

      {/* 카운트 */}
      <p className="text-sm text-white/70 mb-5 sm:mb-6">
        {mode === 'sessions'
          ? (sessions.length > 0 ? `${sessions.length}개의 세션` : '아직 비어있어요')
          : (characters.length > 0 ? `${characters.length}명의 등장 인물` : '등장 인물이 없어요')
        }
      </p>

      {/* 컨텐츠 */}
      {sessions.length === 0 ? (
        <EmptyState onAddNew={onAddNew} />
      ) : mode === 'sessions' ? (
        <div className="space-y-5">
          {sessions.map(s => (
            <SessionCard
              key={s.id}
              session={s}
              onOpen={() => onOpenSession(s)}
              onEdit={() => onEdit?.(s)}
              onDelete={() => onDelete?.(s)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {characters.map(c => (
            <CharacterCard
              key={c.name}
              character={c}
              onClick={() => onOpenCharacter(c)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
        active
          ? 'bg-white text-ink shadow-sm'
          : 'text-white/80 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ onAddNew }) {
  return (
    <div className="bg-card/95 rounded-3xl shadow-card p-12 sm:p-16 text-center">
      <div className="text-5xl mb-4 opacity-40">⌬</div>
      <h3 className="font-bold text-xl mb-2">
        첫 번째 세션을 추가해보세요
      </h3>
      <p className="text-sm text-whisper mb-6 max-w-md mx-auto leading-relaxed">
        확장프로그램으로 추출한 밴드 백업 JSON을 가져오면<br />
        제목과 표지를 더해 이곳에 모아둘 수 있어요.
      </p>
      <button
        onClick={onAddNew}
        className="px-5 py-2.5 bg-ink text-white rounded-full text-sm font-semibold hover:bg-lavender-700 transition-colors"
      >
        백업 파일 가져오기
      </button>
    </div>
  );
}
