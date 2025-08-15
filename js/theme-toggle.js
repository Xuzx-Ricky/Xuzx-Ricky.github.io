(function () {
  const STORAGE_KEY = 'icarus-theme';
  const icon = document.getElementById('theme-icon');
  const lightLink = document.getElementById('theme-light');
  const darkLink = document.getElementById('theme-dark');

  // 如果元素不存在，直接退出
  if (!icon || !lightLink || !darkLink) return;

  // 初始化主题
  let theme = localStorage.getItem(STORAGE_KEY) || 'light';
  applyTheme(theme);

  // 应用主题函数
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);

    // 主主题切换
    lightLink.disabled = t === 'dark';
    darkLink.disabled  = t === 'light';

    // highlight 主题切换
    //document.getElementById('highlight-light').disabled = t === 'dark';
    //document.getElementById('highlight-dark').disabled  = t === 'light';

    icon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem(STORAGE_KEY, t);
  }

  // 绑定主题切换事件
  document.addEventListener('click', (e) => {
    if (e.target.closest('#theme-toggle')) {
      theme = theme === 'light' ? 'dark' : 'light';
      applyTheme(theme);
    }
  });

  // 处理页面加载完成后的主题应用
  document.addEventListener('DOMContentLoaded', () => {
    // 确保在页面加载完成后应用主题
    setTimeout(() => {
      document.documentElement.setAttribute('data-theme', theme);
    }, 100);
  });

  // 处理PJAX加载后的主题应用
  document.addEventListener('pjax:complete', () => {
    setTimeout(() => {
      document.documentElement.setAttribute('data-theme', theme);
    }, 100);
  });
})();;