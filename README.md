# TOEIC Quest

From 255 to Blue Badge

Every Word Counts.
Every Point Matters.

## 技術

- React
- Vite
- JavaScript
- CSS
- localStorage
- Browser Speech API

## 本機啟動

```bash
npm install
npm run dev
```

## 正式建置

```bash
npm run build
```

## GitHub Pages 部署

這個專案已經設定好 Vite 的 `base`：

```js
base: "/toeic-quest/"
```

並已加入 `gh-pages` 與部署指令：

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

### 部署步驟

1. 安裝依賴

```bash
npm install
```

2. 建置專案

```bash
npm run build
```

3. 發布到 GitHub Pages

```bash
npm run deploy
```

### GitHub Pages 後台設定

請到你的 Repository：

`toeic-quest`

依序進入：

`Settings`  
`Pages`  
`Build and deployment`  
`Source`  
選擇 `Deploy from a branch`  
`Branch` 選擇 `gh-pages`  
按下 `Save`

### 部署後網址

[https://wanying-collab.github.io/toeic-quest/](https://wanying-collab.github.io/toeic-quest/)

## 路由說明

這個專案沒有使用 `BrowserRouter`。

目前採用 hash 導覽邏輯，因此部署到 GitHub Pages 後重新整理不會因為一般前端路由而直接 404。
