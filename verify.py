# -*- coding: utf-8 -*-
"""驗證 pirate-guide：內部連結、page 編號、HTML 標籤平衡、資源路徑。"""
import io, os, re, sys, glob

ROOT = r'd:\pirate-guide'
LANGS = ['zh-TW', 'zh-CN', 'en', 'ja']
SLUGS = ['01-quickstart','02-modjson','03-data','04-images','05-audio',
         '06-shows','07-stages','08-conflict','09-troubleshoot','10-showeditor']

errors = []
warns  = []

def rel(p):
    return os.path.relpath(p, ROOT).replace('\\', '/')

# ---------- 逐檔檢查 ----------
for lang in LANGS:
    langdir = os.path.join(ROOT, lang)
    if not os.path.isdir(langdir):
        warns.append('語言目錄還不存在（尚未撰寫）: %s' % lang)
        continue

    files = []
    idx = os.path.join(langdir, 'index.html')
    if os.path.isfile(idx):
        files.append((idx, 0))
    else:
        errors.append('缺少 %s/index.html' % lang)

    for i, slug in enumerate(SLUGS):
        f = os.path.join(langdir, 'pages', slug + '.html')
        if os.path.isfile(f):
            files.append((f, i + 1))
        else:
            warns.append('缺少 %s/pages/%s.html' % (lang, slug))

    for path, expect_page in files:
        s = io.open(path, encoding='utf-8').read()
        r = rel(path)

        # 1. buildNav page 編號
        m = re.search(r"buildNav\(\{\s*lang:\s*'([^']+)'\s*,\s*page:\s*(\d+)\s*\}\)", s)
        if not m:
            errors.append('%s: 找不到 buildNav 呼叫' % r)
        else:
            got_lang, got_page = m.group(1), int(m.group(2))
            if got_lang != lang:
                errors.append('%s: buildNav lang=%s，應為 %s' % (r, got_lang, lang))
            if got_page != expect_page:
                errors.append('%s: buildNav page=%d，應為 %d' % (r, got_page, expect_page))

        # 2. 資源相對路徑深度
        depth_css = '../css/style.css' if expect_page == 0 else '../../css/style.css'
        depth_js  = '../js/nav.js'     if expect_page == 0 else '../../js/nav.js'
        if depth_css not in s:
            errors.append('%s: CSS 路徑應為 %s' % (r, depth_css))
        if depth_js not in s:
            errors.append('%s: JS 路徑應為 %s' % (r, depth_js))

        # 3. 內部 href 指向的檔案要存在
        for href in re.findall(r'href="([^"#?][^"]*?\.html)"', s):
            target = os.path.normpath(os.path.join(os.path.dirname(path), href))
            if not os.path.isfile(target):
                errors.append('%s: 連結目標不存在 -> %s' % (r, href))

        # 4. 必要骨架元素
        for need in ['<aside class="sidebar">', 'class="menu-btn"',
                     'class="backdrop"', '<nav class="pager">']:
            if need not in s:
                errors.append('%s: 缺少骨架元素 %s' % (r, need))

        # 5. <title> 存在
        if not re.search(r'<title>.+?</title>', s, re.S):
            errors.append('%s: 缺少 <title>' % r)

        # 6. div 標籤平衡
        opens  = len(re.findall(r'<div\b', s))
        closes = len(re.findall(r'</div>', s))
        if opens != closes:
            errors.append('%s: <div> 不平衡 開%d 關%d' % (r, opens, closes))

        # 7. pre/code 平衡
        for tag in ['pre', 'code', 'table', 'main', 'aside']:
            o = len(re.findall(r'<%s\b' % tag, s))
            c = len(re.findall(r'</%s>' % tag, s))
            if o != c:
                errors.append('%s: <%s> 不平衡 開%d 關%d' % (r, tag, o, c))

        # 8. 原始 < > 洩漏偵測（指令沒轉義會被瀏覽器吃掉）
        #    只掃 <pre> 區塊內的疑似遊戲指令
        for block in re.findall(r'<pre>(.*?)</pre>', s, re.S):
            for bad in re.findall(r'<(?!/?(?:code|strong|em|br|span)\b)([A-Z][A-Za-z]*)>', block):
                errors.append('%s: <pre> 內有未轉義的 <%s>（應寫成 &lt;%s&gt;）' % (r, bad, bad))

# ---------- 根首頁 ----------
root_idx = os.path.join(ROOT, 'index.html')
if os.path.isfile(root_idx):
    s = io.open(root_idx, encoding='utf-8').read()
    for lang in LANGS:
        if ('%s/index.html' % lang) not in s:
            warns.append('根首頁沒有連到 %s/' % lang)
else:
    errors.append('缺少根 index.html')

# ---------- nav.js 與 SLUGS 一致 ----------
navjs = io.open(os.path.join(ROOT, 'js', 'nav.js'), encoding='utf-8').read()
m = re.search(r'const SLUGS = \[(.*?)\];', navjs, re.S)
if not m:
    errors.append('nav.js: 找不到 SLUGS')
else:
    js_slugs = re.findall(r"'([^']+)'", m.group(1))
    if js_slugs != SLUGS:
        errors.append('nav.js SLUGS 與驗證器不符:\n  js=%s\n  期望=%s' % (js_slugs, SLUGS))

for lang in LANGS:
    m = re.search(r"'%s':\s*\{(.*?)\n  \}," % re.escape(lang), navjs, re.S)
    if not m:
        errors.append('nav.js: 找不到 %s 的 CHAPTERS' % lang)
        continue
    items = re.search(r'items:\s*\[(.*?)\]', m.group(1), re.S)
    if not items:
        errors.append('nav.js: %s 缺 items' % lang)
    else:
        n = len(re.findall(r"'", items.group(1))) // 2
        if n != len(SLUGS):
            errors.append('nav.js: %s items 有 %d 筆，應為 %d' % (lang, n, len(SLUGS)))

# ---------- 報告 ----------
print('=' * 60)
if warns:
    print('提醒 (%d):' % len(warns))
    for w in warns:
        print('  - ' + w)
    print()
if errors:
    print('錯誤 (%d):' % len(errors))
    for e in errors:
        print('  X ' + e)
    print('=' * 60)
    sys.exit(1)
else:
    print('全部檢查通過。')
    print('=' * 60)
