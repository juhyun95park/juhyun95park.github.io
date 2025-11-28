/**
 * Main Application Module
 * 메인 페이지 게시글 목록 관리
 */

(function() {
  'use strict';

  let allPosts = [];

  /**
   * 게시글 목록 불러오기
   */
  async function loadPosts() {
    try {
      const response = await fetch('posts.json');
      if (!response.ok) {
        throw new Error('posts.json을 불러올 수 없습니다.');
      }
      allPosts = await response.json();
      return allPosts;
    } catch (error) {
      console.error('Error loading posts:', error);
      return [];
    }
  }

  /**
   * 날짜 포맷팅
   */
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '.' + month + '.' + day;
  }

  /**
   * 게시글 카드 HTML 생성
   */
  function createPostCard(post) {
    const tagsHtml = post.tags && post.tags.length > 0
      ? post.tags.map(function(tag) {
          return '<span class="post-card-tag">#' + tag + '</span>';
        }).join('')
      : '';

    return '<article class="post-card">' +
      '<h2 class="post-card-title">' +
        '<a href="post.html?p=' + encodeURIComponent(post.file) + '">' + post.title + '</a>' +
      '</h2>' +
      '<div class="post-card-meta">' +
        (post.date ? '<span>📅 ' + formatDate(post.date) + '</span>' : '') +
        (post.category ? '<span>📁 ' + post.category + '</span>' : '') +
      '</div>' +
      (post.excerpt ? '<p class="post-card-excerpt">' + post.excerpt + '</p>' : '') +
      (tagsHtml ? '<div class="post-card-tags">' + tagsHtml + '</div>' : '') +
    '</article>';
  }

  /**
   * 게시글 목록 렌더링
   */
  function renderPosts(posts) {
    const listContainer = document.getElementById('posts-list');
    const noPostsElement = document.getElementById('no-posts');
    
    if (!listContainer) return;

    if (!posts || posts.length === 0) {
      listContainer.innerHTML = '';
      if (noPostsElement) noPostsElement.style.display = 'block';
      return;
    }

    if (noPostsElement) noPostsElement.style.display = 'none';
    
    const html = posts.map(createPostCard).join('');
    listContainer.innerHTML = html;
  }

  /**
   * 로딩 상태 표시
   */
  function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.display = show ? 'flex' : 'none';
    }
  }

  /**
   * 앱 초기화
   */
  async function init() {
    showLoading(true);

    try {
      // 게시글 로드
      const posts = await loadPosts();

      // 검색 모듈 초기화
      if (window.SearchModule) {
        window.SearchModule.init(posts);

        // 태그 렌더링
        window.SearchModule.renderTags(function(filteredPosts) {
          renderPosts(filteredPosts);
        });

        // 검색 입력 설정
        window.SearchModule.setupSearchInput(function(filteredPosts) {
          renderPosts(filteredPosts);
        });

        // URL에 태그 파라미터가 있으면 해당 태그로 필터링
        const activeTag = window.SearchModule.getActiveTag();
        if (activeTag) {
          const filteredPosts = window.SearchModule.filterByTag(activeTag);
          renderPosts(filteredPosts);
        } else {
          renderPosts(posts);
        }
      } else {
        renderPosts(posts);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      renderPosts([]);
    } finally {
      showLoading(false);
    }
  }

  // DOM 로드 후 초기화
  document.addEventListener('DOMContentLoaded', init);
})();

