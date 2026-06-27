// 카카오톡 스타일 채팅 미리보기
import { cleanText } from '../lib/text.js';

export default function DmPreview({ data }) {
  return (
    <div className="bg-kakao-bg rounded-lg p-4 sm:p-6 shadow-paper">
      <div className="max-w-2xl mx-auto space-y-1">
        {data.messages.map((msg, i) => <MsgRow key={i} msg={msg} prev={data.messages[i-1]} />)}
      </div>
    </div>
  );
}

function MsgRow({ msg, prev }) {
  if (msg.type === 'date') {
    return (
      <div className="flex justify-center my-4">
        <span className="text-xs text-white/80 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
          {msg.text}
        </span>
      </div>
    );
  }

  const isMe = msg.type === 'me';
  const samePrev = prev && prev.type === msg.type && prev.name === msg.name;
  const body = cleanText(msg.body);

  if (isMe) {
    return (
      <div className="flex justify-end items-end gap-1">
        <span className="text-[10px] text-whisper mb-0.5 shrink-0">{msg.time}</span>
        <div className="max-w-[70%] bg-kakao-me text-ink rounded-2xl rounded-tr-md px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {body}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 shrink-0">
        {!samePrev && (
          <div className="w-8 h-8 rounded-full bg-lavender-100 flex items-center justify-center text-xs text-whisper">
            {msg.name?.[0] || '?'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {!samePrev && msg.name && (
          <div className="text-xs text-white/90 mb-0.5">{msg.name}</div>
        )}
        <div className="flex items-end gap-1">
          <div className="max-w-[70%] bg-kakao-other text-ink rounded-2xl rounded-tl-md px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {body}
          </div>
          <span className="text-[10px] text-whisper mb-0.5 shrink-0">{msg.time}</span>
        </div>
      </div>
    </div>
  );
}
