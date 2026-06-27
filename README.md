# 역극 정돈소 (band-rp-formatter)

밴드 백업을 모아둘 수 있는 **세션 라이브러리** 웹앱.

- 라벤더 무드의 카드 그리드 라이브러리
- 카드 클릭 시 디테일 뷰: 카카오톡 충실 재현 (DM) / 챕터 형식 (게시글)
- 표지, 장르 태그, GM, PC, 날짜, 시놉시스를 직접 입력

## 스택
- Vite 6 + React 18 + Tailwind 3
- localStorage 기반 영속화

## 로컬 실행
```bash
npm install
npm run dev          # http://localhost:5173
```

## 빌드 & 배포
```bash
npm run build
netlify deploy --prod
```

## 현재 (v0.2)
- ✅ 라이브러리 뷰 (카드 그리드, 라벤더 톤)
- ✅ JSON 업로드 → 메타데이터 입력 → 라이브러리 저장
- ✅ 표지 이미지 업로드 (base64, 2MB 이하)
- ✅ DM 백업 → 카카오톡 미리보기
- ✅ 게시글 백업 → 챕터 형식 + 댓글 트리
- ✅ localStorage 영속화

## 다음 (v0.3+)
- ⬜ 확장프로그램에서 자동 데이터 전달 (`postMessage`)
- ⬜ 본문/댓글 인라인 편집
- ⬜ AI 정돈 (소설/대본 스타일)
- ⬜ PDF/JPG 다운로드
- ⬜ 카드 정렬/필터 (날짜, 장르)

## 데이터 모델

세션 1개:
```json
{
  "id": "uuid",
  "title": "생계무책 生計無策",
  "tag": "CoC",
  "description": "시놉시스...",
  "gm": "할미",
  "pcs": ["스텔라 리어", "아서 청"],
  "date": "2024-01-21",
  "dateEnd": null,
  "cover": "data:image/...",
  "kind": "post",
  "data": { /* 원본 백업 JSON */ }
}
```
