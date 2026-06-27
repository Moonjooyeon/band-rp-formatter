import { colorForTag } from '../lib/colors.js';

export default function SessionCard({ session, onOpen, onEdit, onDelete }) {
  const tagColor = colorForTag(session.tag || session.kind || 'default');
  const dateText = formatDate(session.date, session.dateEnd);

  return (
    <article
      className="group bg-card rounded-3xl shadow-card hover:shadow-card-hover transition-all overflow-hidden cursor-pointer flex flex-col sm:flex-row"
      onClick={onOpen}
    >
      {/* 커버 영역 */}
      <div className="relative sm:w-[280px] sm:min-w-[280px] aspect-[4/3] sm:aspect-auto bg-lavender-200 overflow-hidden">
        {session.cover ? (
          <img
            src={session.cover}
            alt={session.title || ''}
            className="w-full h-full object-cover"
          />
        ) : (
          <PlaceholderCover title={session.title} />
        )}
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col min-w-0 relative">
        {/* 상단: 태그 + 세션 표시 */}
        <div className="flex items-start justify-between gap-3 mb-2">
          {session.tag && (
            <span
              className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold text-white tracking-wide"
              style={{ backgroundColor: tagColor }}
            >
              {session.tag}
            </span>
          )}
          <span className="text-[10px] text-whisper bg-lavender-50 px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
            {kindLabel(session.kind)} ⏷
          </span>
        </div>

        {/* 제목 */}
        <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2 leading-tight">
          {session.title || '제목 없음'}
        </h2>

        {/* 설명 */}
        {session.description && (
          <p className="text-sm text-whisper leading-relaxed mb-4 line-clamp-3">
            {session.description}
          </p>
        )}

        {/* 메타 */}
        <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
          {session.gm && (
            <>
              <dt className="text-whisper font-medium">GM</dt>
              <dd className="text-ink">{session.gm}</dd>
            </>
          )}
          {session.pcs?.length > 0 && (
            <>
              <dt className="text-whisper font-medium">PC</dt>
              <dd className="text-ink">{session.pcs.join(', ')}</dd>
            </>
          )}
          {dateText && (
            <>
              <dt className="text-whisper font-medium">날짜</dt>
              <dd className="text-ink">{dateText}</dd>
            </>
          )}
        </dl>

        {/* 액션 (편집/삭제) */}
        <div className="absolute bottom-3 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => { e.stopPropagation(); onEdit?.(); }}
            className="w-7 h-7 flex items-center justify-center text-whisper hover:text-ink rounded hover:bg-lavender-50"
            title="편집"
          >
            ✎
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete?.(); }}
            className="w-7 h-7 flex items-center justify-center text-whisper hover:text-tagRed rounded hover:bg-lavender-50"
            title="삭제"
          >
            🗑
          </button>
        </div>
      </div>
    </article>
  );
}

function PlaceholderCover({ title }) {
  // 제목 첫글자 기반 그라데이션 (개성 부여)
  const seed = (title || '?').charCodeAt(0) || 0;
  const hueA = (seed * 37) % 360;
  const hueB = (hueA + 50) % 360;
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, hsl(${hueA} 30% 30%), hsl(${hueB} 35% 18%))`,
      }}
    >
      <span className="font-serif text-5xl text-white/30 select-none">
        {(title || '?')[0]}
      </span>
    </div>
  );
}

function kindLabel(kind) {
  if (kind === 'dm') return 'DM';
  if (kind === 'post') return '세션';
  return '기록';
}

function formatDate(start, end) {
  if (!start) return '';
  if (end && end !== start) return `${start} ~ ${end}`;
  return start;
}
