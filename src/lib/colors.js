// 작성자/장르 → 결정론적 색상

const AUTHOR_PALETTE = [
  { fg: '#8C2A1F', bg: '#FBE9E5' }, // vermilion
  { fg: '#5C6B8E', bg: '#E8EDF5' }, // dusty blue
  { fg: '#7A6A8C', bg: '#EDE8F2' }, // muted purple
  { fg: '#5C7A5A', bg: '#E8EFE6' }, // forest
  { fg: '#9B6A2C', bg: '#F4EBD9' }, // honey
  { fg: '#A56565', bg: '#F2E3E3' }, // rosewood
  { fg: '#467775', bg: '#DDEBEA' }, // teal
  { fg: '#7C5D9B', bg: '#EDE6F4' }, // amethyst
  { fg: '#856B43', bg: '#EFE6D7' }, // amber-brown
  { fg: '#3F7A6E', bg: '#DCEAE7' }, // celadon
];

const TAG_PALETTE = [
  '#5B7AB8', // blue
  '#D4843A', // orange
  '#B83838', // red
  '#5C8A6E', // green
  '#7E5BB8', // purple
  '#B89238', // amber
  '#3A8A92', // teal
  '#8C5A8C', // mauve
];

function hash(s) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export function colorForAuthor(name) {
  if (!name) return AUTHOR_PALETTE[0];
  return AUTHOR_PALETTE[hash(name) % AUTHOR_PALETTE.length];
}

export function colorForTag(tag) {
  if (!tag) return TAG_PALETTE[0];
  return TAG_PALETTE[hash(tag) % TAG_PALETTE.length];
}
