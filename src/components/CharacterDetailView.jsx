import SessionCard from './SessionCard.jsx';
import { colorForAuthor } from '../lib/colors.js';

export default function CharacterDetailView({ character, onBack, onOpenSession, onDeleteSession }) {
  const color = colorForAuthor(character.name);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
      {/* 뒤로 + 자캐 헤더 */}
      <button
        onClick={onBack}
        className="text-sm text-white/80 hover:text-white flex items-center gap-1 mb-6 group transition-colors"
      >
        <span className="transition-transform group-hover:-translate-x-0.5">←</span>
        <span>라이브러리</span>
      </button>

      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-card shrink-0"
          style={{ backgroundColor: color.bg, color: color.fg }}
        >
          {character.name?.[0] || '?'}
        </div>
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-semibold mb-1">
            CHARACTER
          </div>
          <h1 className="font-bold text-white text-2xl sm:text-3xl tracking-tight">
            {character.name}
          </h1>
          <p className="text-sm text-white/70 mt-1">
            {character.sessionCount}개 세션에 등장
          </p>
        </div>
      </div>

      {/* 세션 카드 리스트 */}
      <div className="space-y-5">
        {character.sessions.map(s => (
          <SessionCard
            key={s.id}
            session={s}
            onOpen={() => onOpenSession(s)}
            onDelete={() => onDeleteSession?.(s)}
          />
        ))}
      </div>
    </div>
  );
}
