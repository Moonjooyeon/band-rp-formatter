# 커뮤 백업 (Communal Backup)

밴드(BAND) 백업을 모아두는 세션 라이브러리 웹앱.

🔗 https://bandrpformatter.netlify.app/

## 기능
- 라벤더 무드의 카드 그리드 라이브러리
- 카드 클릭 시 디테일 뷰: 카카오톡 충실 재현 (DM) / 챕터 형식 (게시글)
- 표지, 장르 태그, GM, PC, 날짜, 시놉시스 직접 입력
- 확장프로그램 [band-rp-backup]에서 자동 데이터 전송

## 스택
- Vite 6 + React 18 + Tailwind 3
- localStorage 기반 영속화 (브라우저 단위)

## 로컬 실행
```bash
npm install
npm run dev
```

## 배포
GitHub에 push하면 Netlify가 자동으로 재빌드/재배포.

## 데이터 모델
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

## 다음
- AI 정돈 (소설/대본 스타일)
- PDF/JPG 다운로드
- 카드 정렬/필터
