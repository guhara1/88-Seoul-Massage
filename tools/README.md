# 색인 자동화 (IndexNow + 구글 Indexing API)

빙·네이버·얀덱스(IndexNow)와 구글(Indexing API)에 URL을 **즉시 색인 통보**하는 도구입니다.

- 사이트 도메인: `88-seoul-massage.netlify.app`
- IndexNow 키: `7a8d3c91-2f4e-4b7a-9d2e-1f3a5c8e7d2b`
- 키 파일(배포됨): `https://88-seoul-massage.netlify.app/7a8d3c91-2f4e-4b7a-9d2e-1f3a5c8e7d2b.txt`

> ⚠️ **선행 조건**: 키 파일이 배포되어 실제 URL에서 200으로 열려야 IndexNow가 작동합니다.
> 도메인 연결(Cloudflare Pages Custom domain) 완료 후 사용하세요.

---

## 0. 설치

```bash
pip install requests google-auth   # google-auth는 구글 API에만 필요
```

## 1. IndexNow — 빙 · 네이버 · 얀덱스 (구글 미참여)

### 전체 사이트 일괄 통보 (첫 통보 / 대량 갱신)
```bash
python tools/indexnow.py
```
인자 없이 실행하면 `88-seoul-massage.netlify.app`의 `sitemap.xml` 전체 URL을
빙·네이버·얀덱스에 한 번에 통보합니다. (사이트맵이 실제 URL에서 열려야 함)

### 글 1개만 즉시 통보 (글 올릴 때마다)
```bash
python tools/indexnow.py --urls https://88-seoul-massage.netlify.app/area/seoul/gangnam-gu/
```
여러 개도 가능:
```bash
python tools/indexnow.py --urls \
  https://88-seoul-massage.netlify.app/area/busan/ \
  https://88-seoul-massage.netlify.app/area/busan/haeundae-gu/
```

## 2. 구글 Indexing API (구글 즉시 색인)

구글은 IndexNow에 참여하지 않으므로 별도 API를 씁니다.

**준비 (1회):**
1. Google Cloud Console에서 프로젝트 생성 → **Indexing API** 사용 설정
2. 서비스 계정 생성 → JSON 키 다운로드 → `credentials/google-indexing-sa.json`에 저장
3. **Search Console**에서 해당 사이트 속성에 서비스 계정 이메일을 **소유자**로 추가

```bash
# 전체 사이트맵 통보 (credentials/google-indexing-sa.json 기본 사용)
python tools/google_indexing_api.py

# 글 1개
python tools/google_indexing_api.py --urls https://88-seoul-massage.netlify.app/area/seoul/
```
> 구글 Indexing API는 공식적으로 JobPosting·BroadcastEvent용이며 일반 페이지는
> 일일 200 URL 쿼터가 있습니다. 일반 페이지의 가장 확실한 방법은 **Search Console에
> sitemap 제출**입니다(아래 3번).

## 3. 사이트맵 제출 (가장 기본 · 필수)

- **구글**: [Search Console](https://search.google.com/search-console) → 사이트맵 →
  `sitemap.xml` 제출
- **네이버**: [서치어드바이저](https://searchadvisor.naver.com) → 메인 메타
  (`naver-site-verification` = `df1493fcf20f4e772c3000d81e5ce0267bd2c5c2`)로 소유확인 후 사이트맵 제출
- **빙**: [Bing Webmaster](https://www.bing.com/webmasters) → 사이트맵 제출 (IndexNow 자동 연동)

> 참고: 구글의 `ping?sitemap=` 엔드포인트는 2023년 6월 **폐지**되어 더 이상
> 동작하지 않습니다. 사이트맵은 Search Console로 제출하세요.

---

## 4. 매 배포 시 자동 통보 (선택)

배포(빌드 후) 때마다 자동으로 IndexNow에 알리려면 CI에 한 줄 추가:

```bash
npm run build && python tools/indexnow.py
```

또는 cron으로 매일 1회:
```cron
# 매일 새벽 3시 전체 사이트맵 IndexNow 통보
0 3 * * * cd /path/to/repo && python tools/indexnow.py >> logs/indexnow.log 2>&1
```

## 설정 파일 `.env.local` (로컬 전용 · git 제외)

```
INDEXNOW_DOMAIN=88-seoul-massage.netlify.app
INDEXNOW_KEY=7a8d3c91-2f4e-4b7a-9d2e-1f3a5c8e7d2b
SITEMAP_URL=https://88-seoul-massage.netlify.app/sitemap.xml
GOOGLE_CREDENTIALS=credentials/google-indexing-sa.json
```

## 파일

| 파일 | 용도 |
|---|---|
| `indexnow.py` | 빙·네이버·얀덱스 즉시 통보 (무인자 실행 지원) |
| `google_indexing_api.py` | 구글 Indexing API 통보 (서비스 계정 필요) |
| `../public/7a8d3c91-...txt` | IndexNow 키 검증 파일 (배포됨) |
| `../.env.local` | 도메인·키 설정 (로컬 전용) |
