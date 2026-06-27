/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 라벤더 무드 (라이브러리 톤)
        lavender: {
          50:  '#F5F1FA',
          100: '#E8DFF3',
          200: '#D3C2E9',
          300: '#B9A4D9',
          400: '#9F87C8',
          500: '#876DB5',
          600: '#705798',
          700: '#5A437A',
          800: '#42305A',
          900: '#2A1F3C',
        },
        // 카드/텍스트
        card: '#FCFAFE',
        ink: '#2A2438',
        whisper: '#6B6477',
        mist: '#9F87C8',

        // 장르 태그 팔레트 (해시 매핑용)
        tagBlue:   '#5B7AB8',
        tagOrange: '#D4843A',
        tagRed:    '#B83838',
        tagGreen:  '#5C8A6E',
        tagPurple: '#7E5BB8',
        tagAmber:  '#B89238',
        tagTeal:   '#3A8A92',

        // KakaoTalk 충실 재현 (디테일 뷰)
        kakao: {
          bg: '#ABC1D1',
          me: '#FEE500',
          other: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['Pretendard', '"Apple SD Gothic Neo"', 'sans-serif'],
        body: ['Pretendard', '"Apple SD Gothic Neo"', 'sans-serif'],
        serif: ['"Noto Serif KR"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(66, 48, 90, 0.12), 0 1px 3px rgba(66, 48, 90, 0.06)',
        'card-hover': '0 8px 32px rgba(66, 48, 90, 0.18), 0 2px 6px rgba(66, 48, 90, 0.08)',
      },
      backgroundImage: {
        'lavender-mist': 'radial-gradient(ellipse at top, #B9A4D9 0%, #876DB5 45%, #5A437A 100%)',
      },
    },
  },
  plugins: [],
};
