# 행렬 계산 과정

S020의 독립적인 buildless 행렬 도구입니다. `dist/` 전체를 정적으로 호스팅하며 `dist/index.html`이 시작점입니다. 설치·빌드·외부 라이브러리·외부 폰트가 필요 없습니다. ES modules를 사용하므로 HTTPS 또는 localhost HTTP에서 실행합니다.

## 기능

- 2×2~6×6 정사각행렬. 정수, 최대 소수 6자리, `a/b` 분수 입력. 행은 줄바꿈, 값은 공백·쉼표·세미콜론 구분.
- 최대 절댓값 피벗을 선택하는 Gauss–Jordan 소거. 행 교환·상수배·행 가산의 모든 단계와 확대행렬 `[A | I | b]` 표시.
- 행렬식, rank, nullity, RREF, 역행렬 또는 명시적인 특이 행렬 판정, 영공간 기저.
- 선택적인 우변 벡터로 `Ax=b` 계산. 유일해·무한해·모순을 구분하고 특수해 및 영공간 매개변수 표현 제공.
- 정확한 BigInt 유리수 계산. 분수/유효숫자 10자리 근삿값 표시 전환. 표시는 계산 정밀도에 영향을 주지 않음.
- 가역·특이·영행렬의 실제 계산 예제, 결과 복사와 UTF-8 계산 과정 TXT 저장.
- 한국어 루트 및 `/en/`, `/es/`, `/zh/`, `/ja/`, `/de/` 전체 UI·오류·결과·도움말 현지화. 각 경로에서 수동 언어 메뉴 제공. 사용자 데이터는 번역하지 않음.

## 가정과 범위

값은 무차원 유리수입니다. 절댓값과 입력 분모는 각각 1,000,000 이하, 연산 중 정수는 1,000자리 이하입니다. 소수 입력은 정확한 유리수로 취급합니다. 분모 0, 비유한 값, 지수 표기, 표현식, 불완전한 구분자·비정사각 행렬·벡터 길이 불일치는 거부합니다. `eval` 또는 `Function`을 사용하지 않습니다. 모든 계산은 기기 안에서 수행하며 업로드·영구 저장·자동 삭제·분석·광고가 없습니다.

직사각행렬, 고유값, 복소수, 대규모 수치 선형대수는 지원하지 않습니다. 입력을 수정하면 이전 계산을 지우고 다시 계산하도록 안내합니다. 소수 출력은 반올림되므로 정확한 값은 분수 표시를 사용하세요.

`generate.mjs`는 카탈로그 수정 후 6언어 정적 HTML을 생성하는 개발 도구입니다. 배포 과정에는 실행할 필요가 없습니다. 360px 반응형 CSS, 레이블과 키보드 접근을 제공합니다. 브라우저 시각 QA는 수행하지 않았으며 소유자가 담당합니다.

## 검증

프로젝트 루트 기준으로 아래 명령을 실행했습니다. 작업 환경의 RTK 실행 파일 및 제공된 Node 런타임을 명시적으로 호출했습니다.

```sh
rtk proxy node generate.mjs
rtk proxy node --check dist/core.js
rtk proxy node --check dist/app.js
rtk proxy node --check dist/i18n.js
rtk proxy node tests.mjs
```

실제 결과: 6언어 route 생성, 3개 문법 검사 exit 0, 11개 fixture PASS. 독립적인 알려진 2×2 및 3×3 역행렬·행렬식·해, 행 교환 부호·최대 피벗 선택, 특이행렬·영행렬·모순·무한해, 근특이 소수의 정확한 계산, 6×6 대각행렬, 분수 계수, 잘못된 입력과 복잡도 제한, 6언어 route·언어 메뉴·base 경로·오류 현지화를 검증했습니다.

## 참고

- Georgia Tech, Interactive Linear Algebra, Row Reduction: https://textbooks.math.gatech.edu/ila/row-reduction.html
- Georgia Tech, Interactive Linear Algebra, Matrix Inverses: https://textbooks.math.gatech.edu/ila/matrix-inverses.html

수학 원리의 참조 링크만 제공하며 원문·이미지·코드·디자인을 복제하지 않았습니다. 구현, UI, CSS, 번역 및 예제는 이 프로젝트의 원본 작업입니다.

## Public GitHub Pages release

Launch: https://nanalab.kr/matrix-workbench/

Korean is at the root. English, Spanish, Chinese, Japanese and German use `/en/`, `/es/`, `/zh/`, `/ja/`, `/de/`.
GitHub Pages serves `main` → `/docs` using the branch build. No project CNAME is used.

Build: `node scripts/build-public.mjs`. The `dist/` snapshot and its original generators/tests are preserved as the application source. The public build adds metadata, six-locale sitemaps, original JPEG cards, More Apps styling and the existing NaNa publisher integrations. It does not upload selected user files.

Publisher integrations: AdSense, Google Tag Manager, Google Analytics and Cloudflare Web Analytics, with the same publisher settings as the NaNa Lab homepage. These scripts can make network requests independently of local file processing.

Original JPEG cards are rendered from original text and geometry using an installed system font; no font files are redistributed. Existing source references and third-party notices remain applicable.
