import { Plugin } from "obsidian";

export default class LazyCursor extends Plugin {
	async onload() {
		this.registerEvent(
			this.app.workspace.on("file-open", () => {
				const editor = this.app.workspace.activeEditor?.editor;
				if (editor) {
					// requestAnimationFrame ensures DOM is painted
					// before unfocusing — critical for mobile WebView
					requestAnimationFrame(() => editor.blur());
				}
			})
		);
	}

	onunload() {}
}
