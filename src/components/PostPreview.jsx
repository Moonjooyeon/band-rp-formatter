import CommentItem from './CommentItem.jsx';
import { colorForAuthor } from '../lib/colors.js';
import { splitParagraphs } from '../lib/text.js';

export default function PostPreview({ data }) {
  const authorColor = colorForAuthor(data.meta.author);
  const paragraphs = splitParagraphs(data.body);

  return (
    <article className="max-w-2xl mx-auto">
      {/* 작성자 + 시간 */}
      <header className="flex items-center gap-3 pb-6 mb-8 border-b border-lavender-100">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ backgroundColor: authorColor.bg, color: authorColor.fg }}
        >
          {data.meta.author?.[0] || '?'}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm leading-tight" style={{ color: authorColor.fg }}>
            {data.meta.author || '익명'}
          </div>
          {data.meta.postTime && (
            <time className="text-[11px] text-whisper">{data.meta.postTime}</time>
          )}
        </div>
      </header>

      {/* 본문 - 단락별 분리 */}
      {paragraphs.length > 0 && (
        <div className="space-y-4 mb-12">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[15px] leading-[1.85] text-ink whitespace-pre-wrap break-words">
              {p}
            </p>
          ))}
        </div>
      )}

      {/* 댓글 섹션 */}
      {data.comments.length > 0 && (
        <section>
          {/* 구분선 + 라벨 */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-whisper">
              Replies · {data.meta.commentCount}
            </span>
            <div className="flex-1 h-px bg-lavender-100" />
          </div>

          <div className="space-y-8">
            {data.comments.map((c, i) => (
              <CommentItem key={i} comment={c} depth={0} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
