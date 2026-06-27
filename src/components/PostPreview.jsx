import CommentItem from './CommentItem.jsx';
import { colorForAuthor } from '../lib/colors.js';

export default function PostPreview({ data }) {
  const authorColor = colorForAuthor(data.meta.author);
  return (
    <article className="bg-white border border-mokpan rounded-lg overflow-hidden shadow-paper">
      {/* 챕터 헤더 */}
      <header className="p-6 sm:p-10 border-b border-mokpan bg-paper">
        <div className="flex items-center gap-2 text-xs text-whisper mb-3">
          <span className="chapter-mark font-display">CHAPTER</span>
          <span className="manuscript-rule flex-1 mx-2" />
          <time>{data.meta.postTime || '시각 미상'}</time>
        </div>
        {data.meta.author && (
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium"
              style={{ backgroundColor: authorColor.bg, color: authorColor.fg }}
            >
              {data.meta.author[0]}
            </div>
            <span className="font-medium text-sm" style={{ color: authorColor.fg }}>
              {data.meta.author}
            </span>
          </div>
        )}
      </header>

      {/* 본문 */}
      <div className="p-6 sm:p-10">
        <div className="font-display text-base leading-loose whitespace-pre-wrap break-words text-ink max-w-prose">
          {data.body}
        </div>
      </div>

      {/* 댓글 */}
      {data.comments.length > 0 && (
        <div className="border-t border-mokpan bg-paper/50 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-display text-sm font-semibold text-whisper uppercase tracking-wider">
              Comments · {data.meta.commentCount}
            </h3>
            <div className="manuscript-rule flex-1" />
          </div>
          <div className="divide-y divide-mokpan/60">
            {data.comments.map((c, i) => (
              <CommentItem key={i} comment={c} depth={0} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
