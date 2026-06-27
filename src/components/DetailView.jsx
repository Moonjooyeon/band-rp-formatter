import DmPreview from './DmPreview.jsx';
import PostPreview from './PostPreview.jsx';
import { colorForTag } from '../lib/colors.js';

export default function DetailView({ session, onBack }) {
  const data = session.data;
  const tagColor = colorForTag(session.tag || session.kind || 'default');

  return (
    <div className="bg-white min-h-screen">
      {/* 디테일 헤더 */}
      <header className="border-b border-lavender-100 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-sm text-whisper hover:text-ink flex items-center gap-1 transition-colors"
          >
            <span>←</span>
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
          <h1 className="font-serif font-bold text-ink truncate flex-1">
            {session.title}
          </h1>
          <div className="text-xs text-whisper hidden sm:block">
            {data.kind === 'dm'
              ? `💬 ${data.meta.messageCount}개 메시지`
              : `📝 ${data.meta.commentCount}개 댓글`
            }
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 세션 메타 (있을 때만) */}
        {(session.gm || session.pcs?.length || session.description) && (
          <div className="mb-6 pb-5 border-b border-lavender-100">
            {session.description && (
              <p className="text-sm text-ink leading-relaxed mb-3">{session.description}</p>
            )}
            <dl className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
              {session.gm && (
                <div className="flex gap-2">
                  <dt className="text-whisper font-medium">GM</dt>
                  <dd className="text-ink">{session.gm}</dd>
                </div>
              )}
              {session.pcs?.length > 0 && (
                <div className="flex gap-2">
                  <dt className="text-whisper font-medium">PC</dt>
                  <dd className="text-ink">{session.pcs.join(', ')}</dd>
                </div>
              )}
              {session.date && (
                <div className="flex gap-2">
                  <dt className="text-whisper font-medium">날짜</dt>
                  <dd className="text-ink">
                    {session.dateEnd && session.dateEnd !== session.date
                      ? `${session.date} ~ ${session.dateEnd}`
                      : session.date}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* 액션 바 (향후) */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            disabled
            className="px-3 py-1.5 text-xs border border-lavender-100 rounded-md text-whisper cursor-not-allowed opacity-50"
            title="다음 버전에서 제공"
          >
            ✨ AI 정돈
          </button>
          <button
            disabled
            className="px-3 py-1.5 text-xs border border-lavender-100 rounded-md text-whisper cursor-not-allowed opacity-50"
            title="다음 버전에서 제공"
          >
            📄 PDF/JPG
          </button>
        </div>

        {/* 백업 본문 미리보기 */}
        {data.kind === 'dm' ? <DmPreview data={data} /> : <PostPreview data={data} />}
      </main>
    </div>
  );
}
