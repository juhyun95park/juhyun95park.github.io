---
title: "GitHub Pages 블로그 시작하기"
date: 2025-11-28
tags: ["GitHub Pages", "블로그", "마크다운"]
category: "Tutorial"
description: "GitHub Pages를 이용한 정적 블로그 구축 가이드"
---

# 환영합니다! 👋

이 블로그는 **GitHub Pages**를 이용하여 구축된 정적 블로그입니다. 마크다운으로 작성된 게시글을 자동으로 HTML로 변환하여 보여줍니다.

## 주요 기능

### 🌙 다크/라이트 모드

오른쪽 상단의 버튼을 클릭하여 테마를 전환할 수 있습니다. 시스템 설정을 자동으로 감지합니다.

### 🔍 검색 기능

게시글 제목, 내용, 태그를 기반으로 빠르게 검색할 수 있습니다.

### 🏷️ 태그 필터링

태그를 클릭하면 해당 태그가 포함된 게시글만 필터링됩니다.

### 💬 댓글 시스템

[Giscus](https://giscus.app)를 이용한 GitHub Discussions 기반 댓글 시스템을 지원합니다.

## 코드 하이라이팅

다양한 프로그래밍 언어의 코드 하이라이팅을 지원합니다.

### JavaScript 예시

```javascript
// 게시글 목록을 가져오는 함수
async function loadPosts() {
  const response = await fetch("posts.json");
  const posts = await response.json();
  return posts;
}

// 사용 예시
loadPosts().then((posts) => {
  console.log(`총 ${posts.length}개의 게시글`);
});
```

### Python 예시

```python
def greet(name: str) -> str:
    """인사 메시지를 반환합니다."""
    return f"안녕하세요, {name}님!"

# 사용 예시
message = greet("방문자")
print(message)
```

### HTML/CSS 예시

```html
<article class="post-card">
  <h2 class="post-title">게시글 제목</h2>
  <p class="post-excerpt">게시글 요약...</p>
</article>
```

```css
.post-card {
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--bg-secondary);
  transition: transform 0.2s ease;
}

.post-card:hover {
  transform: translateY(-4px);
}
```

## 마크다운 문법

### 텍스트 스타일

- **굵은 텍스트**는 `**텍스트**`로 작성합니다.
- *기울임 텍스트*는 `*텍스트*`로 작성합니다.
- ~~취소선~~은 `~~텍스트~~`로 작성합니다.
- `인라인 코드`는 백틱으로 감쌉니다.

### 인용문

> 이것은 인용문입니다.
> 여러 줄로 작성할 수 있습니다.

### 목록

1. 첫 번째 항목
2. 두 번째 항목
   - 중첩된 항목
   - 또 다른 항목
3. 세 번째 항목

### 링크

[GitHub](https://github.com)로 이동하려면 클릭하세요.

---

## 게시글 작성 방법

1. `pages/` 폴더에 `.md` 파일 생성
2. Front Matter 작성 (제목, 날짜, 태그 등)
3. 마크다운으로 내용 작성
4. Git에 커밋 & 푸시
5. GitHub Actions가 자동으로 배포!

```markdown
---
title: "게시글 제목"
date: 2025-01-01
tags: ["태그1", "태그2"]
category: "카테고리"
description: "게시글 설명"
---

# 본문 내용 작성...
```

즐거운 블로깅 되세요! 🚀
