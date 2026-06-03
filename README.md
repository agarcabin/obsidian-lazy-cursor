# Lazy Cursor — Mobile Edition

> Forked from [TimoBechtel/obsidian-lazy-cursor](https://github.com/TimoBechtel/obsidian-lazy-cursor)

When you open a note in Obsidian, the cursor is **automatically blurred** — no blinking caret distracting you on the first line. You tap (mobile) or click (desktop) the editor to start writing.

## ✨ Changes from the original

| Change | Detail |
|--------|--------|
| 📱 **Mobile support** | `isDesktopOnly: false` — now works on iOS & Android Obsidian |
| ⚡ **requestAnimationFrame blur** | Wrapped `blur()` in `rAF` to ensure DOM is painted before unfocusing — critical for mobile WebView timing |
| 🔇 **Zero overhead** | No settings panel, no persistent listeners, no timers — fires once per `file-open` and exits |

### What was modified

**`manifest.json`**
```diff
- "isDesktopOnly": true
+ "isDesktopOnly": false
```

**`main.js`** — the `file-open` handler:
```diff
- (_b = (_a = this.app.workspace.activeEditor) == null ? void 0 : _a.editor) == null ? void 0 : _b.blur();
+ var editor = (_b = (_a = this.app.workspace.activeEditor) == null ? void 0 : _a.editor);
+ if (editor) {
+   // rAF ensures mobile DOM layout completes before blur
+   requestAnimationFrame(function() { return editor.blur(); });
+ }
```

## 🔧 How it works

```
file-open  →  rAF  →  editor.blur()
  (zero-cost, fires once per note open)
```

- Listens to Obsidian's `file-open` workspace event
- On mobile, `requestAnimationFrame` waits for the WebView to finish layout before removing focus — prevents a race where the editor isn't fully mounted yet
- No polling, no MutationObserver, no persistent CPU cost

## 📦 Install

### Manual
1. Download `main.js` + `manifest.json`
2. Place in `<vault>/.obsidian/plugins/lazy-cursor/`
3. Enable "Lazy Cursor" in Settings → Community plugins

### BRAT
```
TimoBechtel/obsidian-lazy-cursor
```

## 📄 License

MIT — © 2023 Timo Bechtel. Modifications by Reasonix.
