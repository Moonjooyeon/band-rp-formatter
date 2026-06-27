import { colorForAuthor } from '../lib/colors.js';

export default function CommentItem({ comment, depth = 0 }) {
  const color = colorForAuthor(comment.name);
  const isFiltered = comment._filteredOut;

  return (
    <div className="comment-item" style={{ marginLeft: depth > 0 ? `${depth * 1.5}rem` : 0 }}>
      <div className={`flex gap-3 ${depth > 0 ? 'pt-3 border-l-2 pl-3' : 'py-3'}`}
           style={depth > 0 ? { borderLeftColor: color.bg } : {}}>
        <div
          className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-medium"
          style={{ backgroundColor: color.bg, color: color.fg }}
        >
          {comment.name?.[0] || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span
              className="text-sm font-medium"
              style={{ color: color.fg }}
            >
              {comment.name || '익명'}
            </span>
            {comment.nameExtra && (
              <span className="text-[10px] text-whisper truncate">
                {comment.nameExtra}
              </span>
            )}
            {comment.time && (
              <span className="text-[10px] text-whisper ml-auto shrink-0">
                {comment.time}
              </span>
            )}
          </div>
          {isFiltered ? (
            <p className="text-xs text-whisper italic">[ 필터로 가려진 댓글 ]</p>
          ) : (
            <div className="text-sm leading-relaxed text-ink whitespace-pre-wrap break-words">
              {comment.body}
            </div>
          )}
        </div>
      </div>

      {comment.replies?.length > 0 && (
        <div className="reply-list">
          {comment.replies.map((r, i) => (
            <CommentItem key={i} comment={r} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
