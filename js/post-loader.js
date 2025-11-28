/**
 * Post Loader Module
 * 마크다운 게시글 로딩 및 파싱
 */

(function () {
  "use strict";

  /**
   * URL에서 게시글 파일명 추출
   */
  function getPostFileName() {
    const params = new URLSearchParams(window.location.search);
    return params.get("p");
  }

  /**
   * Front Matter 파싱
   */
  function parseFrontMatter(content) {
    // UTF-8 BOM 제거
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }

    const frontMatterMatch = content.match(
      /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
    );

    if (!frontMatterMatch) {
      return { metadata: {}, content: content };
    }

    const frontMatter = frontMatterMatch[1];
    const postContent = frontMatterMatch[2];
    const metadata = {};

    // Front Matter 라인 파싱
    const lines = frontMatter.split(/\r?\n/);
    lines.forEach(function (line) {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // 따옴표 제거
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // 배열 파싱 (tags)
        if (key === "tags" && value.startsWith("[") && value.endsWith("]")) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = value
              .slice(1, -1)
              .split(",")
              .map(function (tag) {
                return tag.trim().replace(/^['"]|['"]$/g, "");
              });
          }
        }

        metadata[key] = value;
      }
    });

    return { metadata: metadata, content: postContent };
  }

  /**
   * 마크다운을 HTML로 변환
   */
  function renderMarkdown(content) {
    // marked.js 설정
    if (typeof marked !== "undefined") {
      marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
      });
      return marked.parse(content);
    }
    // marked.js가 로드되지 않은 경우 원본 반환
    return "<pre>" + content + "</pre>";
  }

  /**
   * 코드 하이라이팅 적용
   */
  function highlightCode() {
    if (typeof Prism !== "undefined") {
      Prism.highlightAll();
    }
  }

  /**
   * 게시글 메타 정보 렌더링
   */
  function renderPostMeta(metadata) {
    const metaContainer = document.getElementById("post-meta");
    if (!metaContainer) return;

    let html = "";

    if (metadata.date) {
      html += '<span class="post-meta-item">📅 ' + metadata.date + "</span>";
    }

    if (metadata.category) {
      html +=
        '<span class="post-meta-item">📁 ' + metadata.category + "</span>";
    }

    metaContainer.innerHTML = html;
  }

  /**
   * 게시글 태그 렌더링
   */
  function renderPostTags(tags) {
    const tagsContainer = document.getElementById("post-tags");
    if (!tagsContainer || !tags || !Array.isArray(tags) || tags.length === 0) {
      if (tagsContainer) tagsContainer.style.display = "none";
      return;
    }

    const html = tags
      .map(function (tag) {
        return (
          '<a href="index.html?tag=' +
          encodeURIComponent(tag) +
          '" class="post-tag">#' +
          tag +
          "</a>"
        );
      })
      .join("");

    tagsContainer.innerHTML = html;
  }

  /**
   * 페이지 제목 업데이트
   */
  function updatePageTitle(title) {
    document.title = title + " - juhyun95park's Blog";
    const titleElement = document.getElementById("post-title");
    if (titleElement) {
      titleElement.textContent = title;
    }
  }

  /**
   * 로딩 상태 표시
   */
  function showLoading(show) {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.style.display = show ? "flex" : "none";
    }
  }

  /**
   * 에러 표시
   */
  function showError(message) {
    const contentContainer = document.getElementById("post-content");
    if (contentContainer) {
      contentContainer.innerHTML =
        '<div class="error-message"><p>⚠️ ' +
        message +
        '</p><a href="index.html">← 목록으로 돌아가기</a></div>';
    }
    updatePageTitle("오류");
  }

  /**
   * Giscus 댓글 로드
   */
  function loadGiscus() {
    const container = document.getElementById("giscus-container");
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "juhyun95park/juhyun95park.github.io");
    script.setAttribute("data-repo-id", "R_kgDOQec18w"); // Giscus 설정에서 복사
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOQec1884CzIym"); // Giscus 설정에서 복사
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "1");
    script.setAttribute("data-input-position", "top");
    script.setAttribute(
      "data-theme",
      window.getCurrentTheme() === "dark" ? "dark" : "light"
    );
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    container.appendChild(script);
  }

  /**
   * 게시글 로드
   */
  async function loadPost() {
    const fileName = getPostFileName();

    if (!fileName) {
      showError("게시글을 찾을 수 없습니다.");
      showLoading(false);
      return;
    }

    try {
      const response = await fetch("pages/" + fileName);

      if (!response.ok) {
        throw new Error("게시글을 불러올 수 없습니다.");
      }

      const content = await response.text();
      const { metadata, content: markdownContent } = parseFrontMatter(content);

      // 제목 설정
      const title = metadata.title || fileName.replace(".md", "");
      updatePageTitle(title);

      // 메타 정보 렌더링
      renderPostMeta(metadata);

      // 마크다운 → HTML 변환
      const htmlContent = renderMarkdown(markdownContent);

      const contentContainer = document.getElementById("post-content");
      if (contentContainer) {
        contentContainer.innerHTML = htmlContent;
      }

      // 태그 렌더링
      renderPostTags(metadata.tags);

      // 코드 하이라이팅
      highlightCode();

      // Giscus 로드
      loadGiscus();
    } catch (error) {
      console.error("Error loading post:", error);
      showError(error.message);
    } finally {
      showLoading(false);
    }
  }

  /**
   * 초기화
   */
  document.addEventListener("DOMContentLoaded", loadPost);
})();
