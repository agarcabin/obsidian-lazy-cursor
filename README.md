[English](#english) | [中文](#中文)

---

<a id="english"></a>
# Lazy Cursor — Mobile Edition

> Forked from [TimoBechtel/obsidian-lazy-cursor](https://github.com/TimoBechtel/obsidian-lazy-cursor) (MIT)

When you open a note in Obsidian, the cursor is **automatically blurred** — no blinking caret on the first line. Tap (mobile) or click (desktop) to start typing. **That's it.**

## ✨ Why this over [cursor-goaway](https://github.com/liuxingyu521/obsidian-plugin-cursor-goaway)?

| Aspect | Lazy Cursor (this) | cursor-goaway |
|--------|--------------------|---------------|
| **Blur strategy** | Single `rAF` → `blur()`, done | 500ms `rAF` loop (~30 `blur()` calls) |
| **CPU cost after open** | **Zero** — fires once, exits | Non-zero — 500ms of per-frame blur spam |
| **Key listener** | ❌ None | Registers global `keydown` (ArrowDown) |
| **Memory leak risk** | ❌ None (no state) | ⚠️ Manual handler cleanup required |
| **Internal API access** | ❌ None | Accesses `editor.cm` (CodeMirror internal) |
| **Restore cursor** | Tap/click anywhere | Press `↓` key (not intuitive on mobile) |
| **Mobile support** | ✅ Native | ❌ ArrowDown key not available on mobile |
| **File filter** | All files (zero-config) | `.md` only |
| **CSS file** | ❌ None | Ships empty `styles.css` |
| **Code size (logic)** | ~6 lines | ~50 lines |

**TL;DR** — Lazy Cursor does the same job with **zero ongoing cost**: one frame, one blur, done. No key listeners. No 500ms loop. No CodeMirror internals. Mobile-first.

## 🔧 How it works

```
file-open  →  requestAnimationFrame  →  editor.blur()
  (one-shot, zero persistent listeners)
```

- Hooks Obsidian's `file-open` workspace event
- `requestAnimationFrame` waits for the WebView / DOM to finish paint — critical on mobile where layout is async
- After that single `blur()`, the plugin is idle until the next file-open

## 🆚 Changes from the original (TimoBechtel)

| Change | Why |
|--------|-----|
| `isDesktopOnly: false` | Mobile Obsidian uses the same API — no reason to block it |
| `requestAnimationFrame` wrapper | Mobile WebView may not have editor mounted synchronously; `rAF` guarantees DOM is ready |

```diff
// manifest.json
- "isDesktopOnly": true
+ "isDesktopOnly": false

// main.js — file-open handler
- editor.blur();
+ requestAnimationFrame(() => editor.blur());
```

## 📦 Install

### Manual
1. Download `main.js` + `manifest.json`
2. Place in `<vault>/.obsidian/plugins/lazy-cursor/`
3. Enable in Settings → Community plugins

### BRAT
```
agarcabin/obsidian-lazy-cursor
```

## 📄 License

MIT — © 2023 Timo Bechtel. Modifications © 2025 Reasonix.

---

<a id="中文"></a>
# Lazy Cursor — 移动版

> Fork 自 [TimoBechtel/obsidian-lazy-cursor](https://github.com/TimoBechtel/obsidian-lazy-cursor) (MIT)

打开 Obsidian 笔记时，光标**自动失焦**——第一行不再有闪烁的光标干扰阅读。点击编辑器即可开始输入。**就这么简单。**

## ✨ 相比 [cursor-goaway](https://github.com/liuxingyu521/obsidian-plugin-cursor-goaway) 的优势

| 对比维度 | Lazy Cursor（本插件） | cursor-goaway |
|----------|----------------------|---------------|
| **失焦策略** | 单次 `rAF` → `blur()`，结束 | 500ms `rAF` 循环（约 30 次 blur） |
| **打开后的 CPU 开销** | **零** — 一击即退 | 持续 500ms，每帧都在 blur |
| **键盘监听** | ❌ 无 | 注册全局 `keydown`（监听 ↓ 键） |
| **内存泄漏风险** | ❌ 无（无状态） | ⚠️ 需手动清理 handler |
| **内部 API 访问** | ❌ 无 | 访问 `editor.cm`（CodeMirror 内部属性） |
| **恢复光标方式** | 点击编辑器任意位置 | 按 `↓` 键（移动端不可用） |
| **移动端支持** | ✅ 原生支持 | ❌ 移动端无 ↓ 键 |
| **文件过滤** | 所有文件（零配置） | 仅 `.md` 文件 |
| **CSS 文件** | ❌ 无 | 附带空 `styles.css` |
| **逻辑代码量** | ~6 行 | ~50 行 |

**总结**：Lazy Cursor 用**零持续开销**完成同样的事——一帧、一次 blur、结束。无键盘监听、无 500ms 循环、无 CodeMirror 内部依赖。移动端原生可用。

## 🔧 工作原理

```
file-open  →  requestAnimationFrame  →  editor.blur()
  （一次性触发，零持续监听）
```

- 监听 Obsidian 的 `file-open` 工作区事件
- `requestAnimationFrame` 等待 WebView/DOM 完成渲染——这对移动端尤其重要，因为移动端的布局是异步的
- 执行完单次 `blur()` 后插件进入空闲，直到下次打开文件

## 🆚 相比原版 (TimoBechtel) 的改动

| 改动 | 原因 |
|------|------|
| `isDesktopOnly: false` | 移动端 Obsidian 使用相同 API，无理由禁用 |
| `requestAnimationFrame` 包裹 | 移动端 WebView 编辑器可能尚未同步挂载，`rAF` 确保 DOM 就绪 |

```diff
// manifest.json
- "isDesktopOnly": true
+ "isDesktopOnly": false

// main.js — file-open 处理
- editor.blur();
+ requestAnimationFrame(() => editor.blur());
```

## 📦 安装

### 手动安装
1. 下载 `main.js` + `manifest.json`
2. 放入 `<vault>/.obsidian/plugins/lazy-cursor/`
3. 在设置 → 第三方插件中启用

### BRAT 安装
```
agarcabin/obsidian-lazy-cursor
```

## 📄 许可证

MIT — © 2023 Timo Bechtel。修改 © 2025 Reasonix。
