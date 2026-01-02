// --- 翻訳エンジン ---
let i18n = {};

async function initI18n() {
    try {
        // デフォルトは日本語。将来的にブラウザ言語で分岐も可能！
        const response = await fetch('./ja_jp.json');
        i18n = await response.json();
        applyTranslation();
        console.log("📡 Language loaded.");
    } catch (e) {
        console.error("❌ Language file missing. Using raw keys.", e);
    }
}

function t(key) {
    return i18n[key] || key; // 翻訳がなければキーをそのまま返す（隊員のこだわり！）
}

function applyTranslation() {
    // 1. テキストコンテンツの置換
    // 要素を全走査して、text. から始まるテキストを置換する
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToReplace = [];
    while(node = walker.nextNode()) {
        if (node.nodeValue.trim().startsWith("text.")) {
            nodesToReplace.push(node);
        }
    }
    nodesToReplace.forEach(node => {
        node.nodeValue = t(node.nodeValue.trim());
    });
}

// --- 既存のロジックを統合 ---
// (ここに以前の IndexedDB や MediaRecorder のロジックを記述する)
// ログ出力の関数も t() を通すように修正：
function addLog(msgKey, detail = "") {
    const log = document.getElementById('logArea');
    const msg = t(msgKey) + (detail ? `: ${detail}` : "");
    log.innerText += `[${new Date().toLocaleTimeString()}] ${msg}\n`;
    log.scrollTop = log.scrollHeight;
}

// ページ読み込み時に実行
window.addEventListener('DOMContentLoaded', initI18n);
