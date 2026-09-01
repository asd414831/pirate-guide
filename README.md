# pirate-guide

《海盜》模組製作手冊 / Pirate Mod Making Guide / パイレーツ MOD制作ガイド / 해적 모드 제작 가이드

線上閱讀：https://asd414831.github.io/pirate-guide/

## 這個 repo 是什麼

給模組作者看的手冊。純靜態網頁，沒有建置步驟 —— 改 HTML 推上去就更新。

## 結構

```
index.html          語言選擇（依瀏覽器語言自動跳轉）
css/style.css       共用樣式（各語言共用，深淺色自動切換）
js/nav.js           側邊導覽 / 語言切換 / 手機抽屜
assets/             圖片與 GIF（三語共用，不重複放）
  zh-TW/  zh-CN/  en/  ja/  ko/    各語言內容
  index.html          該語言總覽
  pages/01..08.html   章節
```

## 改東西的時候

- **章節標題 / 新增語言** → 只改 `js/nav.js` 的 `CHAPTERS` 和 `LANGS`，不用動 24 個 HTML
- **新增章節** → `js/nav.js` 的 `SLUGS` 加一筆 + 各語言的 `items` 各加一筆 + 各語言的 `pages/` 各放一個 HTML
- **樣式** → `css/style.css`，所有語言共用

## 內容來源

手冊寫的規則對照遊戲實際實作。發現手冊與遊戲行為不一致時，以遊戲行為為準並回報。

## 授權

見 LICENSE（若有）。
