// js/main.js
let i18n = {};

async function initI18n() {
    try {
        // 1. 言語リスト(lang.json)を取得してセレクトボックス作成
        const langRes = await fetch('./text/lang.json');
        const langList = await langRes.json();
        
        const select = document.createElement('select');
        select.id = "langSelector";
        select.style.cssText = "margin-bottom: 10px; padding: 5px; border-radius: 5px;";

        for (let code in langList) {
            const opt = document.createElement('option');
            opt.value = code;
            opt.innerText = langList[code];
            select.appendChild(opt);
        }
        document.querySelector('.container').prepend(select);

        // 2. ブラウザの言語設定を確認
        const userLang = navigator.language.split('-')[0]; // "ja-JP" -> "ja"
        const defaultLang = langList[userLang] ? userLang : 'ja_jp'; // リストになければ日本語

        // 3. イベント登録
        select.addEventListener('change', (e) => loadLanguage(e.target.value));
        
        // 4. 初回読み込み
        await loadLanguage(defaultLang);
        select.value = defaultLang;

        addLog("text.log.db_ready");
    } catch (e) {
        console.error("❌ I18n System Error:", e);
    }
}

async function loadLanguage(langCode) {
    try {
        const response = await fetch(`./text/${langCode}.json`);
        i18n = await response.json();
        applyTranslation();
        console.log(`📡 Language switched to: ${langCode}`);
    } catch (e) {
        console.warn(`⚠️ Failed to load ${langCode}, using keys.`);
    }
}

function t(key) {
    return i18n[key] || key;
}

function applyTranslation() {
    // ページ上の text. を含むテキストをすべて書き換える
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToReplace = [];
    while(node = walker.nextNode()) {
        const val = node.nodeValue.trim();
        if (val.startsWith("text.")) {
            nodesToReplace.push({node, key: val});
        }
    }
    nodesToReplace.forEach(({node, key}) => {
        node.nodeValue = t(key);
    });
}

// ページ起動
window.addEventListener('DOMContentLoaded', initI18n);
