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
let db;
    let taskList = [];
    const DB_NAME = "GeminiSurvivorDB";
    const STORE_NAME = "CompressedBlobs";

    // --- IndexedDB 初期化 ---
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = e => e.target.result.createObjectStore(STORE_NAME);
    request.onsuccess = e => {
        db = e.target.result;
        addLog("📡 前線基地（IndexedDB）の設営完了！");
    };

    function addLog(msg) {
        const log = document.getElementById('logArea');
        log.innerText += `[${new Date().toLocaleTimeString()}] ${msg}\n`;
        log.scrollTop = log.scrollHeight;
        console.log(`log:${msg}`);
    }

    // --- フォルダ・ファイル解析 ---
    async function scanEntries(item, path = "") {
        const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : item;
        if (entry.isFile) {
            const file = await new Promise(res => entry.file(res));
            return [{ file, path, id: 'id_' + Math.random().toString(36).substr(2, 9) }];
        } else if (entry.isDirectory) {
            let results = [];
            const reader = entry.createReader();
            const entries = await new Promise(res => reader.readEntries(res));
            for (const child of entries) {
                const sub = await scanEntries(child, path + entry.name + "/");
                results = results.concat(sub);
            }
            return results;
        }
        return [];
    }

    const dropZone = document.getElementById('dropZone');
    dropZone.ondragover = e => { e.preventDefault(); dropZone.classList.add('dragover'); };
    dropZone.ondragleave = () => dropZone.classList.remove('dragover');
    dropZone.ondrop = async e => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const items = e.dataTransfer.items;
        addLog("📂 資材の鑑定を開始...");
        for(let i=0; i<items.length; i++) {
            const files = await scanEntries(items[i]);
            taskList = taskList.concat(files);
        }
        renderList();
        addLog(`${taskList.length}個のターゲットを捕捉！`);
    };

    function renderList() {
        const listEl = document.getElementById('fileList');
        listEl.innerHTML = "";
        taskList.forEach((task, index) => {
            const div = document.createElement('div');
            div.className = "file-item";
            div.innerHTML = `
                <div class="file-info">
                    <b>${task.path}${task.file.name}</b><br>
                    <span id="badge-${task.id}" class="status-badge status-wait">待機中</span>
                </div>
                <button id="btn-${task.id}" class="btn-conv" onclick="processFile('${task.id}', ${index})">⚡ 変換</button>
            `;
            listEl.appendChild(div);
        });
        if(taskList.length > 0) {
            document.getElementById('zipBtn').style.display = 'block';
            document.getElementById('clearBtn').style.display = 'block';
        }
    }

    // --- 個別ファイル処理 ---
    async function processFile(id, index) {
        const task = taskList[index];
        const btn = document.getElementById(`btn-${id}`);
        const badge = document.getElementById(`badge-${id}`);

        // 排他ロック：他の変換を許さない
        document.querySelectorAll('.btn-conv').forEach(b => b.disabled = true);
        badge.innerText = "歪曲中(12x)...";
        badge.className = "status-badge status-ing";

        try {
            const blob = await recordOne(task.file);
            
            // IndexedDBに保存
            const tx = db.transaction(STORE_NAME, "readwrite");
            const key = task.path + task.file.name;
            await new Promise((res, rej) => {
                const req = tx.objectStore(STORE_NAME).put(blob, key);
                req.onsuccess = res;
                req.onerror = rej;
            });
            
            badge.innerText = `完了(${Math.round(blob.size/1024)}KB)`;
            badge.className = "status-badge status-ok";
            addLog(`✅ 保存完了: ${task.file.name}`);
            btn.innerText = "済";
            btn.onclick = null;
        } catch (e) {
            addLog(`❌ 失敗: ${task.file.name} - ${e.message}`);
            badge.innerText = "エラー";
            badge.className = "status-badge status-wait";
            btn.disabled = false;
        } finally {
            // ロック解除
            document.querySelectorAll('.btn-conv').forEach(b => {
                if(b.innerText !== "済") b.disabled = false;
            });
        }
    }

    function recordOne(file) {
        return new Promise(async (resolve, reject) => {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            try {
                const arrayBuffer = await file.arrayBuffer();
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.playbackRate.value = 12.0;
                const streamDest = audioCtx.createMediaStreamDestination();
                source.connect(streamDest);
                const recorder = new MediaRecorder(streamDest.stream);
                const chunks = [];
                recorder.ondataavailable = e => { if(e.data.size > 0) chunks.push(e.data); };
                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/mp4' });
                    audioCtx.close().then(() => resolve(blob));
                };
                recorder.start();
                source.start(0);
                setTimeout(() => { source.stop(); recorder.stop(); }, (audioBuffer.duration / 12) * 1000 + 450);
            } catch (err) {
                if(audioCtx) audioCtx.close();
                reject(err);
            }
        });
    }

    // --- ZIPパッキング ---
    document.getElementById('zipBtn').onclick = async () => {
        addLog("📦 ストレージから資材を回収中...");
        const zip = new JSZip();
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        
        for (const task of taskList) {
            const key = task.path + task.file.name;
            const blob = await new Promise(res => {
                const req = store.get(key);
                req.onsuccess = () => res(req.result);
            });
            if (blob && blob.size > 500) {
                const newName = key.replace(/\.[^/.]+$/, "") + ".m4a";
                zip.file(newName, blob);
            } else {
                addLog(`⚠️ ${task.file.name} は未変換のためそのまま格納`);
                zip.file(key, task.file);
            }
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Gemini_Survivor_Pack_${Date.now()}.zip`;
        a.click();
        addLog("🏁 ZIP奪還成功！おめでとうカカオマメ隊員！🫡✨");
    };

    // --- 証拠隠滅 ---
    document.getElementById('clearBtn').onclick = async () => {
        if(!confirm("保存された全ての変換データを抹消し、基地を撤収します。よろしいですか？")) return;
        addLog("🔥 証拠隠滅作戦、開始...");
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).clear().onsuccess = () => {
            localStorage.clear();
            addLog("✅ ストレージ抹消完了");
            location.reload(); // ページをリフレッシュして完全クリーン
        };
    };
// ページ起動
window.addEventListener('DOMContentLoaded', initI18n);
