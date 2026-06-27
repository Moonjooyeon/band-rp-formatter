import { colorForAuthor } from '../lib/colors.js';
import { splitParagraphs } from '../lib/text.js';

export default function CommentItem({ comment, depth = 0 }) {
  const color = colorForAuthor(comment.name);
  const isFiltered = comment._filteredOut;
  const paragraphs = splitParagraphs(comment.body);

  return (
    <div className="comment">
      {/* 작성자 헤더 */}
      <div className="flex items-baseline gap-2 mb-2 flex-wrap">
        <span className="font-bold text-[13px] leading-tight" style={{ color: color.fg }}>
          {comment.name || '익명'}
        </span>
        {comment.nameExtra && (
          <span className="text-[10.5px] text-whisper leading-tight">
            {comment.nameExtra}
          </span>
        )}
        {comment.time && (
          <time className="text-[10.5px] text-whisper ml-auto shrink-0">
            {comment.time}
          </time>
        )}
      </div>

      {/* 본문 */}
      {isFiltered ? (
        <p className="text-[12px] text-whisper/70 italic">— 필터로 가려진 댓글 —</p>
      ) : paragraphs.length > 0 ? (
        <div className="space-y-2.5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[13.5px] leading-[1.8] text-ink whitespace-pre-wrap break-words">
              {p}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-[12px] text-whisper/50 italic">— 빈 댓글 —</p>
      )}

      {/* 답글 - 좌측 컬러 보더로 스레드 표시 */}
      {comment.replies?.length > 0 && (
        <div
          className="mt-5 pl-5 border-l-2 space-y-6"
          style={{ borderColor: color.bg }}
        >
          {comment.replies.map((r, i) => (
            <CommentItem key={i} comment={r} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
