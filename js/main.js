/* ============================================================
   个人主页交互逻辑
   ------------------------------------------------------------
   目前只做两件事：
   1. 深色 / 浅色模式切换（并记住用户的选择）
   2. 页脚年份自动更新

   代码风格说明：
   - 每个函数只做一件事
   - 用 const / let，不用 var
   - 关键位置写清楚「为什么」，而不只是「做什么」
   ============================================================ */


/* ============================================================
   1. 深色模式
   ============================================================ */

const THEME_KEY = 'personal-site-theme';

const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');

/**
 * 根据当前主题，更新按钮上的图标
 * @param {string} theme 'light' 或 'dark'
 */
function updateIcon(theme) {
  // 显示「切换到目标模式」的图标，而不是当前模式
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';

  const label = theme === 'dark' ? '切换到浅色模式' : '切换到深色模式';
  themeToggle.setAttribute('aria-label', label);
  themeToggle.setAttribute('title', label);
}

/**
 * 应用主题，并保存到本地
 * @param {string} theme 'light' 或 'dark'
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  updateIcon(theme);
}

/**
 * 决定初次打开时用什么主题
 * 优先级：用户上次的选择 > 系统设置 > 浅色
 * @returns {string}
 */
function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  // 系统开启了深色模式就跟随系统
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function handleThemeToggle() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}


/* ============================================================
   2. 页脚年份
   ============================================================ */

function updateYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    // 用当前年份，这样页面永远不用手动改
    yearEl.textContent = new Date().getFullYear();
  }
}


/* ============================================================
   3. 初始化
   ============================================================ */

function init() {
  applyTheme(getInitialTheme());
  themeToggle.addEventListener('click', handleThemeToggle);
  updateYear();
}

// DOM 加载完成后再执行，确保能取到所有元素
document.addEventListener('DOMContentLoaded', init);


/* ============================================================
   小练习（建议你自己动手加）：
   ------------------------------------------------------------
   1. 给导航加上「滚动时高亮当前所在区块」
      提示：用 IntersectionObserver 监听各个 section
   2. 首屏加一个打字机效果的自我介绍
      提示：用 setInterval 逐个字符修改 textContent
   3. 技能条加一个「滚动到可视区域才展开」的动画
      提示：还是 IntersectionObserver，改变 span 的 width

   每做完一个，就 commit 一次，这样你的提交记录会很好看。
   ============================================================ */
