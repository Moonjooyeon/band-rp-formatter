import { useMemo } from 'react';
import { colorForAuthor } from '../lib/colors.js';
import { splitParagraphs, cleanText } from '../lib/text.js';

// 댓글 트리를 시간순 흐름으로 평탄화 (답글은 replyingTo로 표시)
// _filteredOut placeholder는 본인은 안 보이고, 답글들의 replyingTo는 그대로 유지
function flattenComments(comments) {
  const flat = [];
  function walk(arr, parentName = null) {
    for (const c of arr) {
      if (!c._filteredOut) {
        flat.push({
          name: c.name,
          nameExtra: c.nameExtra,
          body: c.body,
          time: c.time,
          replyingTo: parentName,
        });
      }
      if (c.replies?.length > 0) walk(c.replies, c.name);
    }
  }
  walk(comments);
  return flat;
}

export default function PostPreview({ data, myCharacter }) {
  const flat = useMemo(() => flattenComments(data.comments), [data.comments]);
  const author = data.meta.author;
  const authorColor = colorForAuthor(author);
  const bodyParagraphs = splitParagraphs(data.body);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* 게시글 본문 카드 */}
      <article className="bg-white rounded-2xl border border-lavender-100 shadow-sm overflow-hidden">
        <header className="flex items-center gap-3 px-5 py-4 border-b border-lavender-100 bg-lavender-50/50">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ backgroundColor: authorColor.bg, color: authorColor.fg }}
          >
            {author?.[0] || '?'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm leading-tight" style={{ color: authorColor.fg }}>
              {author || '익명'}
            </div>
            {data.meta.postTime && (
              <time className="text-[11px] text-whisper">{data.meta.postTime}</time>
            )}
          </div>
          <span className="text-[10px] text-whisper bg-white px-2 py-1 rounded-full border border-lavender-100">
            게시글
          </span>
        </header>
        <div className="px-5 py-5 space-y-3">
          {bodyParagraphs.length > 0 ? bodyParagraphs.map((p, i) => (
            <p key={i} className="text-[14px] leading-[1.85] text-ink whitespace-pre-wrap break-words">
              {p}
            </p>
          )) : (
            <p className="text-[12px] text-whisper italic">— 본문 없음 —</p>
          )}
        </div>
      </article>

      {/* 카톡 채팅창 */}
      {flat.length > 0 && (
        <div className="bg-kakao-bg rounded-2xl p-3 sm:p-4 shadow-sm">
          <div className="flex justify-center mb-3">
            <span className="text-[10px] text-white/90 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
              댓글 · {flat.length}개
            </span>
          </div>
          <div className="space-y-1.5">
            {flat.map((c, i) => {
              const prev = flat[i - 1];
              const isMe = myCharacter && c.name === myCharacter;
              const samePrev = prev && prev.name === c.name && (prev.replyingTo === c.replyingTo);
              return (
                <KakaoBubble key={i} comment={c} isMe={isMe} samePrev={samePrev} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function KakaoBubble({ comment, isMe, samePrev }) {
  const color = colorForAuthor(comment.name);
  const body = cleanText(comment.body);

  if (isMe) {
    return (
      <div className="flex justify-end items-end gap-1">
        <span className="text-[10px] text-whisper mb-1 shrink-0">{comment.time}</span>
        <div className="max-w-[78%] bg-kakao-me text-ink rounded-2xl rounded-tr-md px-3 py-2 text-[13.5px] leading-relaxed whitespace-pre-wrap break-words">
          {comment.replyingTo && (
            <div className="text-[10px] text-ink/50 border-l-2 border-ink/20 pl-2 mb-1.5">
              ↳ {comment.replyingTo}에게 답글
            </div>
          )}
          {body}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 shrink-0">
        {!samePrev && (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: color.bg, color: color.fg }}
          >
            {comment.name?.[0] || '?'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {!samePrev && (
          <div className="text-[11px] mb-0.5 flex items-baseline gap-1.5 flex-wrap">
            <span className="font-semibold" style={{ color: color.fg }}>
              {comment.name}
            </span>
            {comment.nameExtra && (
              <span className="text-white/80 text-[10px]">{comment.nameExtra}</span>
            )}
          </div>
        )}
        <div className="flex items-end gap-1">
          <div className="max-w-[80%] bg-kakao-other text-ink rounded-2xl rounded-tl-md px-3 py-2 text-[13.5px] leading-relaxed whitespace-pre-wrap break-words">
            {comment.replyingTo && (
              <div className="text-[10px] text-whisper border-l-2 border-whisper/40 pl-2 mb-1.5">
                ↳ {comment.replyingTo}에게 답글
              </div>
            )}
            {body}
          </div>
          <span className="text-[10px] text-whisper mb-1 shrink-0">{comment.time}</span>
        </div>
      </div>
    </div>
  );
}
