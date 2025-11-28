/**
 * Theme Toggle Module
 * 다크/라이트 모드 전환 기능
 */

(function() {
  'use strict';

  const THEME_KEY = 'blog-theme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';

  /**
   * 시스템 테마 감지
   */
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_THEME : LIGHT_THEME;
  }

  /**
   * 저장된 테마 또는 시스템 테마 반환
   */
  function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    return saved || getSystemTheme();
  }

  /**
   * 테마 적용
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleIcon(theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  /**
   * 토글 버튼 아이콘 업데이트
   */
  function updateToggleIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === DARK_THEME ? '☀️' : '🌙';
    }
  }

  /**
   * 테마 토글
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
  }

  /**
   * 초기화
   */
  function init() {
    // 초기 테마 적용 (깜빡임 방지를 위해 즉시 실행)
    applyTheme(getSavedTheme());

    // DOM 로드 후 이벤트 리스너 등록
    document.addEventListener('DOMContentLoaded', function() {
      const toggleBtn = document.getElementById('theme-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
      }

      // 시스템 테마 변경 감지
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // 사용자가 직접 테마를 설정하지 않은 경우에만 시스템 테마 따라감
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        }
      });
    });
  }

  // 즉시 실행
  init();

  // 전역 함수 노출 (Giscus 테마 동기화용)
  window.getCurrentTheme = function() {
    return document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
  };
})();

