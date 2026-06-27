// 표시용 텍스트 정리 - 보이지 않는 문자 제거, 과한 공백 압축

export function cleanText(text) {
  if (!text) return '';
  return text
    // 보이지 않는 문자 제거 (non-breaking space, zero-width space, BOM, soft hyphen 등)
    .replace(/[\u00A0\u200B\u200C\u200D\uFEFF\u00AD]/g, ' ')
    // 가로 공백만 압축, 줄바꿈은 보존
    .replace(/[ \t]+/g, ' ')
    // 3개 이상 빈 줄 → 2개
    .replace(/\n[ \t]*\n[ \t]*\n+/g, '\n\n')
    // 각 줄 양끝 trim
    .split('\n').map(ln => ln.trim()).join('\n')
    // 전체 양끝 trim
    .trim();
}

// 빈 줄 기준으로 단락 나누기
export function splitParagraphs(text) {
  const cleaned = cleanText(text);
  return cleaned.split(/\n\n+/).filter(Boolean);
}
