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
  nav += '<div class="lang-box">'
       + '<label class="lang-label" for="langSel">' + (t.langLabel || 'Language') + '</label>'
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
