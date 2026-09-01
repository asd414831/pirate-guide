/* ===================================================================
   海盜 模組製作手冊 — 側邊導覽 / 語言切換 / 手機抽屜
   三語共用。每頁只需要：
     <script src="../../js/nav.js"></script>
     <script>buildNav({ lang:'zh-TW', page:3 });</script>   // page:0 = 首頁
   章節標題在下面的 CHAPTERS 定義，新增章節只改這裡一處。
   =================================================================== */

const LANGS = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en',    label: 'English'  },
  { code: 'ja',    label: '日本語'   },
  { code: 'ko',    label: '한국어'   },
  { code: 'ru',    label: 'Русский'  },
];

// 每語言的章節標題。順序 = 檔名 01..08 的順序。
// 新增章節：三個語言都要加一筆，並在 pages/ 放對應 html。
const CHAPTERS = {
  'zh-TW': {
    brandTitle: '海盜模組製作手冊',
    brandSub:   'Pirate Mod Making Guide',
    home:       '總覽',
    langLabel:  '語言',
    prev:       '上一章',
    next:       '下一章',
    items: [
      '快速開始',
      'mod.json 欄位',
      '修改遊戲資料',
      '加入圖片',
      '加入音樂音效',
      '演出與發放內容',
      '關卡與敵人',
      '多模組共存',
      '疑難排解',
      '演出編輯器',
    ],
  },
  'zh-CN': {
    brandTitle: '海盗模组制作手册',
    brandSub:   'Pirate Mod Making Guide',
    home:       '总览',
    langLabel:  '语言',
    prev:       '上一章',
    next:       '下一章',
    items: [
      '快速开始',
      'mod.json 字段',
      '修改游戏数据',
      '添加图片',
      '添加音乐音效',
      '演出与发放内容',
      '关卡与敌人',
      '多模组共存',
      '疑难排解',
      '演出编辑器',
    ],
  },

  'en': {
    brandTitle: 'Pirate Mod Making Guide',
    brandSub:   'for mod authors',
    home:       'Overview',
    langLabel:  'Language',
    prev:       'Previous',
    next:       'Next',
    items: [
      'Quick Start',
      'mod.json Fields',
      'Editing Game Data',
      'Adding Images',
      'Adding Audio',
      'Shows &amp; Granting Content',
      'Stages &amp; Enemies',
      'Multiple Mods',
      'Troubleshooting',
      'Show Editor',
    ],
  },
  'ja': {
    brandTitle: 'パイレーツ MOD制作ガイド',
    brandSub:   'MOD作者向け',
    home:       '概要',
    langLabel:  '言語',
    prev:       '前の章',
    next:       '次の章',
    items: [
      'はじめに',
      'mod.json の項目',
      'ゲームデータの編集',
      '画像の追加',
      '音楽と効果音の追加',
      '演出とコンテンツ付与',
      'ステージと敵',
      '複数MODの共存',
      'トラブル対処',
      '演出エディタ',
    ],
  },
  'ko': {
    brandTitle: '해적 모드 제작 가이드',
    brandSub:   '모드 제작자를 위한 안내서',
    home:       '개요',
    langLabel:  '언어',
    prev:       '이전 장',
    next:       '다음 장',
    items: [
      '빠른 시작',
      'mod.json 필드',
      '게임 데이터 편집',
      '이미지 추가',
      '오디오 추가',
      '연출과 콘텐츠 지급',
      '스테이지와 적',
      '여러 모드 함께 사용하기',
      '문제 해결',
      '연출 편집기',
    ],
  },
  'ru': {
    brandTitle: 'Руководство по модам Pirate',
    brandSub:   'Справочник для авторов модов',
    home:       'Обзор',
    langLabel:  'Язык',
    prev:       'Предыдущая глава',
    next:       'Следующая глава',
    items: [
      'Быстрый старт',
      'Поля mod.json',
      'Правка данных игры',
      'Добавление изображений',
      'Добавление аудио',
      'Постановки и выдача контента',
      'Этапы и враги',
      'Несколько модов вместе',
      'Решение проблем',
      'Редактор постановок',
    ],
  },
};

// 章節檔名（不分語言，英文固定）。順序要跟 CHAPTERS.items 對齊。
const SLUGS = [
  '01-quickstart',
  '02-modjson',
  '03-data',
  '04-images',
  '05-audio',
  '06-shows',
  '07-stages',
  '08-conflict',
  '09-troubleshoot',
  '10-showeditor',
];

function buildNav(opts) {
  const lang = opts.lang;
  const page = opts.page;              // 0 = 該語言首頁，1..8 = 章節
  const t = CHAPTERS[lang];
  if (!t) { console.error('[nav] unknown lang:', lang); return; }

  // 相對路徑前綴：首頁在 <lang>/，章節在 <lang>/pages/
  const up = page === 0 ? '../' : '../../';
  const langHome = page === 0 ? 'index.html' : '../index.html';
  const pageDir  = page === 0 ? 'pages/' : '';

  // ---- 側邊欄 HTML ----
  let nav = '<div class="brand">'
    + '<a href="' + langHome + '">' + t.brandTitle + '</a>'
    + '<span class="sub">' + t.brandSub + '</span>'
    + '</div>';

  // 語言切換：放在品牌名正下方、章節清單之上。
  //
  // 為什麼移到這裡：原本在側邊欄最底部，章節多的時候要捲到底才看得到 ——
  // 非中文讀者第一眼找不到怎麼換語言，等於沒做多語言。
  //
  // 為什麼用 <select> 而不是三顆按鈕：語言之後可能加到 6 個（遊戲支援
  // 繁中/簡中/英/日/韓/俄），按鈕會擠成兩行。<select> 不管幾個語言都是一行，
  // 而且手機上會叫出系統原生的選單，比一排小按鈕好點。
  // 地球アイコン + セレクト。文字ラベルは出さない ——
  // 「語言 / Language / 言語」と書いてもその言語が読めない人には意味がなく、
  // 地球アイコンのほうが言語非依存で伝わる。読み上げ用に aria-label は残す。
  nav += '<div class="lang-box">'
       + '<svg class="lang-globe" viewBox="0 0 24 24" aria-hidden="true">'
       + '<circle cx="12" cy="12" r="9"/>'
       + '<path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/>'
       + '</svg>'
       + '<select id="langSel" class="lang-select" aria-label="' + (t.langLabel || 'Language') + '">';
  for (const L of LANGS) {
    const target = page === 0
      ? up + L.code + '/index.html'
      : up + L.code + '/pages/' + SLUGS[page - 1] + '.html';
    nav += '<option value="' + target + '"' + (L.code === lang ? ' selected' : '') + '>'
         + L.label + '</option>';
  }
  nav += '</select></div>';

  nav += '<ul class="nav-list">';

  nav += '<li><a href="' + langHome + '"' + (page === 0 ? ' class="active"' : '') + '>'
       + '<span class="num">00</span>' + t.home + '</a></li>';

  for (let i = 0; i < SLUGS.length; i++) {
    const n = i + 1;
    const num = String(n).padStart(2, '0');
    const href = pageDir + SLUGS[i] + '.html';
    nav += '<li><a href="' + href + '"' + (page === n ? ' class="active"' : '') + '>'
         + '<span class="num">' + num + '</span>' + t.items[i] + '</a></li>';
  }
  nav += '</ul>';

  const sb = document.querySelector('.sidebar');
  if (sb) sb.innerHTML = nav;

  // 選了語言就跳過去。用 change 而不是 click —— 鍵盤操作（方向鍵選、Enter 確認）
  // 也要能觸發，click 只吃滑鼠。
  const sel = document.getElementById('langSel');
  if (sel) {
    sel.addEventListener('change', function () {
      if (this.value) location.href = this.value;
    });
  }

  setupResizer(sb);

  // ---- 上下頁 ----
  const pager = document.querySelector('.pager');
  if (pager) {
    let html = '';
    if (page > 1) {
      html += '<a href="' + SLUGS[page - 2] + '.html">&larr; ' + t.prev + '</a>';
    } else if (page === 1) {
      html += '<a href="../index.html">&larr; ' + t.home + '</a>';
    }
    html += '<span class="spacer"></span>';
    if (page > 0 && page < SLUGS.length) {
      html += '<a href="' + SLUGS[page] + '.html">' + t.next + ' &rarr;</a>';
    }
    pager.innerHTML = html;
  }

  // ---- 手機抽屜 ----
  const btn = document.querySelector('.menu-btn');
  const bd  = document.querySelector('.backdrop');
  if (btn) btn.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  if (bd)  bd.addEventListener('click',  () => document.body.classList.remove('nav-open'));
  // 點側邊欄連結後關抽屜（同頁 anchor 時才看得出效果，跨頁無害）
  if (sb) sb.addEventListener('click', e => {
    if (e.target.closest('a')) document.body.classList.remove('nav-open');
  });
}

// 首頁章節卡片（各語言 index.html 用）。descs 由該頁自己傳，因為要翻譯。
function buildCards(lang, descs) {
  const t = CHAPTERS[lang];
  if (!t) return;
  let html = '';
  for (let i = 0; i < SLUGS.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    html += '<a class="card" href="pages/' + SLUGS[i] + '.html">'
          + '<div class="n">' + num + '</div>'
          + '<div class="t">' + t.items[i] + '</div>'
          + '<div class="d">' + (descs[i] || '') + '</div>'
          + '</a>';
  }
  const box = document.querySelector('.cards');
  if (box) box.innerHTML = html;
}

/* ===================================================================
   側邊欄寬度拖曳
   章節名的長度隨語言差很多（日文最長），固定 260px 對某些語言會截斷。
   讓讀者自己調，寬度存 localStorage，換頁後保持。
   =================================================================== */
const SB_MIN = 180, SB_MAX = 480, SB_DEFAULT = 260;
const SB_KEY = 'pg-sidebar-w';

function applySidebarWidth(px) {
  const w = Math.max(SB_MIN, Math.min(SB_MAX, Math.round(px)));
  document.documentElement.style.setProperty('--sidebar-w', w + 'px');
  return w;
}

function saveSidebarWidth(w) {
  // 隱私模式下 localStorage 可能整個 throw，一律包起來
  try { localStorage.setItem(SB_KEY, String(w)); } catch (e) {}
}

function setupResizer(sb) {
  if (!sb) return;

  try {
    const saved = parseInt(localStorage.getItem(SB_KEY), 10);
    if (saved) applySidebarWidth(saved);
  } catch (e) { /* 讀不到就用預設 */ }

  const grip = document.createElement('div');
  grip.className = 'sb-resizer';
  grip.setAttribute('role', 'separator');
  grip.setAttribute('aria-orientation', 'vertical');
  grip.setAttribute('aria-label', 'Resize sidebar');
  grip.tabIndex = 0;
  sb.appendChild(grip);

  let dragging = false;

  function move(e) {
    if (!dragging) return;
    // 側邊欄靠左貼齊，所以游標的 clientX 就是它該有的寬度
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    applySidebarWidth(x);
    e.preventDefault();
  }

  function up() {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove('sb-resizing');
    const w = parseInt(getComputedStyle(document.documentElement)
                       .getPropertyValue('--sidebar-w'), 10);
    if (w) saveSidebarWidth(w);
  }

  function down(e) {
    dragging = true;
    document.body.classList.add('sb-resizing');
    e.preventDefault();
  }

  grip.addEventListener('mousedown', down);
  grip.addEventListener('touchstart', down, { passive: false });
  document.addEventListener('mousemove', move);
  document.addEventListener('touchmove', move, { passive: false });
  document.addEventListener('mouseup', up);
  document.addEventListener('touchend', up);

  // 鍵盤：聚焦握把後用左右鍵調整。滑鼠拖曳對部分使用者不可行。
  grip.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const cur = parseInt(getComputedStyle(document.documentElement)
                         .getPropertyValue('--sidebar-w'), 10) || SB_DEFAULT;
    saveSidebarWidth(applySidebarWidth(cur + (e.key === 'ArrowLeft' ? -16 : 16)));
    e.preventDefault();
  });

  // 雙擊還原預設
  grip.addEventListener('dblclick', function () {
    saveSidebarWidth(applySidebarWidth(SB_DEFAULT));
  });
}
