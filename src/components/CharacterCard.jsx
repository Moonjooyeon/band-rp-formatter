import { colorForAuthor } from '../lib/colors.js';

export default function CharacterCard({ character, onClick }) {
  const color = colorForAuthor(character.name);
  return (
    <button
      onClick={onClick}
      className="bg-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all text-left group"
    >
      <div
        className="w-14 h-14 rounded-full mb-4 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform"
        style={{ backgroundColor: color.bg, color: color.fg }}
      >
        {character.name?.[0] || '?'}
      </div>
      <h3 className="font-bold text-ink mb-1 truncate" style={{ color: color.fg }}>
        {character.name}
      </h3>
      <p className="text-[11px] text-whisper">
        {character.sessionCount}개 세션
      </p>
    </button>
  );
}
