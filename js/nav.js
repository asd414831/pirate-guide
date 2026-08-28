/* ===================================================================
   海盜 模組製作手冊 — 側邊導覽 / 語言切換 / 手機抽屜
   三語共用。每頁只需要：
     <script src="../../js/nav.js"></script>
     <script>buildNav({ lang:'zh-TW', page:3 });</script>   // page:0 = 首頁
   章節標題在下面的 CHAPTERS 定義，新增章節只改這裡一處。
   =================================================================== */

const LANGS = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en',    label: 'English'  },
  { code: 'ja',    label: '日本語'   },
];

// 每語言的章節標題。順序 = 檔名 01..08 的順序。
// 新增章節：三個語言都要加一筆，並在 pages/ 放對應 html。
const CHAPTERS = {
  'zh-TW': {
    brandTitle: '海盜 模組製作手冊',
    brandSub:   'Pirate Mod Making Guide',
    home:       '總覽',
    prev:       '上一章',
    next:       '下一章',
    items: [
      '快速開始',
      'mod.json 欄位',
      '修改遊戲資料',
      '加入圖片',
      '加入音樂音效',
      '多模組共存',
      '疑難排解',
      '演出編輯器',
    ],
  },
  'en': {
    brandTitle: 'Pirate Mod Making Guide',
    brandSub:   'for mod authors',
    home:       'Overview',
    prev:       'Previous',
    next:       'Next',
    items: [
      'Quick Start',
      'mod.json Fields',
      'Editing Game Data',
      'Adding Images',
      'Adding Audio',
      'Multiple Mods',
      'Troubleshooting',
      'Show Editor',
    ],
  },
  'ja': {
    brandTitle: 'パイレーツ MOD制作ガイド',
    brandSub:   'MOD作者向け',
    home:       '概要',
    prev:       '前の章',
    next:       '次の章',
    items: [
      'はじめに',
      'mod.json の項目',
      'ゲームデータの編集',
      '画像の追加',
      '音楽と効果音の追加',
      '複数MODの共存',
      'トラブル対処',
      '演出エディタ',
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
  '06-conflict',
  '07-troubleshoot',
  '08-showeditor',
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
    + '</div><ul class="nav-list">';

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

  // ---- 語言切換：同章對跳 ----
  // 在 en/pages/03-data.html 按日文 → ja/pages/03-data.html（不回首頁）
  nav += '<div class="lang-switch">';
  for (const L of LANGS) {
    const target = page === 0
      ? up + L.code + '/index.html'
      : up + L.code + '/pages/' + SLUGS[page - 1] + '.html';
    nav += '<a href="' + target + '"' + (L.code === lang ? ' class="current"' : '') + '>'
         + L.label + '</a>';
  }
  nav += '</div>';

  const sb = document.querySelector('.sidebar');
  if (sb) sb.innerHTML = nav;

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
