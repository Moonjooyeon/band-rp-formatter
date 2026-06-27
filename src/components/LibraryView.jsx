import SessionCard from './SessionCard.jsx';

export default function LibraryView({ sessions, onOpenSession, onAddNew, onEdit, onDelete }) {
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

      {/* 헤더 */}
      <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white/95 tracking-tight">
            나의 기록
          </h2>
          <p className="text-sm text-white/70 mt-1">
            {sessions.length > 0 ? `${sessions.length}개의 세션` : '아직 비어있어요'}
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="px-4 py-2.5 bg-white text-ink rounded-full text-sm font-semibold shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all flex items-center gap-1.5"
        >
          <span className="text-lavender-600">＋</span>
          새 세션 추가
        </button>
      </div>

      {/* 카드 그리드 또는 비어있음 */}
      {sessions.length === 0 ? (
        <EmptyState onAddNew={onAddNew} />
      ) : (
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
      )}
    </div>
  );
}

function EmptyState({ onAddNew }) {
  return (
    <div className="bg-card/95 rounded-3xl shadow-card p-12 sm:p-16 text-center">
      <div className="text-5xl mb-4 opacity-40">⌬</div>
      <h3 className="font-serif text-xl font-semibold mb-2">
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
