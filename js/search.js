/**
 * Search Module
 * 게시글 검색 및 태그 필터링
 */

(function() {
  'use strict';

  // 검색용 게시글 데이터 (app.js에서 설정)
  let searchPosts = [];
  let activeTag = null;

  /**
   * 검색 초기화
   */
  function initSearch(posts) {
    searchPosts = posts || [];
    
    // URL에서 태그 파라미터 확인
    const params = new URLSearchParams(window.location.search);
    const tagParam = params.get('tag');
    if (tagParam) {
      activeTag = tagParam;
    }
  }

  /**
   * 검색어로 게시글 필터링
   */
  function filterBySearch(query) {
    if (!query || query.trim() === '') {
      return activeTag ? filterByTag(activeTag) : searchPosts;
    }

    const lowerQuery = query.toLowerCase().trim();
    let filtered = searchPosts.filter(function(post) {
      const titleMatch = post.title.toLowerCase().includes(lowerQuery);
      const excerptMatch = post.excerpt && post.excerpt.toLowerCase().includes(lowerQuery);
      const descMatch = post.description && post.description.toLowerCase().includes(lowerQuery);
      const tagsMatch = post.tags && post.tags.some(function(tag) {
        return tag.toLowerCase().includes(lowerQuery);
      });
      const categoryMatch = post.category && post.category.toLowerCase().includes(lowerQuery);

      return titleMatch || excerptMatch || descMatch || tagsMatch || categoryMatch;
    });

    // 활성 태그가 있으면 추가 필터링
    if (activeTag) {
      filtered = filtered.filter(function(post) {
        return post.tags && post.tags.includes(activeTag);
      });
    }

    return filtered;
  }

  /**
   * 태그로 게시글 필터링
   */
  function filterByTag(tag) {
    if (!tag) {
      activeTag = null;
      return searchPosts;
    }

    activeTag = tag;
    return searchPosts.filter(function(post) {
      return post.tags && post.tags.includes(tag);
    });
  }

  /**
   * 모든 태그 추출 (중복 제거)
   */
  function getAllTags() {
    const tagSet = new Set();
    searchPosts.forEach(function(post) {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(function(tag) {
          tagSet.add(tag);
        });
      }
    });
    return Array.from(tagSet).sort();
  }

  /**
   * 태그 버튼 렌더링
   */
  function renderTags(onTagClick) {
    const tagsContainer = document.getElementById('tags-container');
    const tagsSection = document.getElementById('tags-section');
    
    if (!tagsContainer) return;

    const tags = getAllTags();
    
    if (tags.length === 0) {
      if (tagsSection) tagsSection.style.display = 'none';
      return;
    }

    // "전체" 버튼
    let html = '<button class="tag-button' + (!activeTag ? ' active' : '') + '" data-tag="">전체</button>';
    
    // 태그 버튼들
    html += tags.map(function(tag) {
      const isActive = activeTag === tag ? ' active' : '';
      return '<button class="tag-button' + isActive + '" data-tag="' + tag + '">#' + tag + '</button>';
    }).join('');

    tagsContainer.innerHTML = html;

    // 이벤트 리스너 등록
    tagsContainer.querySelectorAll('.tag-button').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const tag = this.getAttribute('data-tag');
        
        // 활성 상태 업데이트
        tagsContainer.querySelectorAll('.tag-button').forEach(function(b) {
          b.classList.remove('active');
        });
        this.classList.add('active');

        // URL 업데이트 (히스토리에 추가하지 않음)
        const url = new URL(window.location);
        if (tag) {
          url.searchParams.set('tag', tag);
        } else {
          url.searchParams.delete('tag');
        }
        window.history.replaceState({}, '', url);

        // 콜백 실행
        if (onTagClick) {
          const filteredPosts = filterByTag(tag || null);
          onTagClick(filteredPosts);
        }
      });
    });
  }

  /**
   * 검색 입력 이벤트 설정
   */
  function setupSearchInput(onSearch) {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener('input', function() {
      const query = this.value;
      
      // 디바운스 적용 (300ms)
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        if (onSearch) {
          const filteredPosts = filterBySearch(query);
          onSearch(filteredPosts);
        }
      }, 300);
    });

    // Enter 키 즉시 검색
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        clearTimeout(debounceTimer);
        if (onSearch) {
          const filteredPosts = filterBySearch(this.value);
          onSearch(filteredPosts);
        }
      }
    });
  }

  /**
   * 현재 활성 태그 반환
   */
  function getActiveTag() {
    return activeTag;
  }

  // 전역 노출
  window.SearchModule = {
    init: initSearch,
    filterBySearch: filterBySearch,
    filterByTag: filterByTag,
    getAllTags: getAllTags,
    renderTags: renderTags,
    setupSearchInput: setupSearchInput,
    getActiveTag: getActiveTag
  };
})();

