// audio.js
// 値の決定時に出力する関数 (ユーザーの指示に従って作成)
function print(value) {
    console.log(value);
}

// ----------------------------------------------------
// ★★★ 1. クエリパラメータの解析関数 ★★★
// ----------------------------------------------------
function getQueryParams() {
    const params = {};
    // audio.jsを読み込んでいるscriptタグのURLを取得する
    const scripts = document.getElementsByTagName('script');
    let scriptSrc = '';

    // 現在実行中のscriptタグのsrcを探す
    for (const script of scripts) {
        if (script.src.includes('audio.js')) {
            scriptSrc = script.src;
            break;
        }
    }
    
    // URLSearchParamsオブジェクトでクエリを解析
    if (scriptSrc) {
        const url = new URL(scriptSrc);
        const urlParams = new URLSearchParams(url.search);
        
        // nameパラメータ
        const name = urlParams.get('name');
        if (name) {
            // 拡張子がない場合は .mp3 を補完
            params.name = name.endsWith('.mp3') ? name : `${name}.mp3`;
        } else {
            // nameがない場合はデフォルトを設定（要件にはないが安全策として）
            params.name = '/bgm/another-eden/bgm_デフォルト.mp3';
        }

        // s (start time)
        const s = parseFloat(urlParams.get('s'));
        params.start = isNaN(s) || s < 0 ? 0 : s;
        
        // e (end time)
        const e = parseFloat(urlParams.get('e'));
        // eが指定されていない、または0以下の場合は、デフォルトの120秒ループを設定
        params.duration = isNaN(e) || e <= 0 ? 120 : e; 
    }
    
    return params;
}

const params = getQueryParams();
const BGM_PATH = params.name ? `/${params.name}` : '/bgm_default.mp3'; // ファイルパス
const START_TIME = params.start || 0; // 再生開始時間
const LOOP_DURATION = params.duration || 120; // ループ終了時間/間隔

print(`Parsed BGM_PATH: ${BGM_PATH}`);
print(`Parsed START_TIME (s): ${START_TIME}`);
print(`Parsed LOOP_DURATION (e): ${LOOP_DURATION}`);


// ----------------------------------------------------
// ★★★ 2. 制御ロジック (再生開始とループ処理を修正) ★★★
// ----------------------------------------------------
let audio; // Audioオブジェクトを保持するための変数
let isPlaying = false; // 現在再生中かどうかの状態を保持
const BUTTON_ID = 'kakakakakakakakaka_bgm_toggle_btn'; // 広告と干渉しないユニークID

/**
 * BGMの再生を開始し、指定された時間ごとにループさせる
 */
function startBGM() {
    if (!audio) {
        audio = new Audio(BGM_PATH);
        print(`audio: ${audio}`);

        // ループ開始位置を設定
        audio.currentTime = START_TIME; 
        print(`audio.currentTime set to START_TIME: ${audio.currentTime}`);

        // 再生時間の監視を設定
        audio.addEventListener('timeupdate', function() {
            // 現在の再生時間がLOOP_DURATIONを超えたら、START_TIMEに戻して再開
            if (audio.currentTime >= LOOP_DURATION) {
                audio.currentTime = START_TIME;
                audio.play();
                console.log(`BGMを${LOOP_DURATION}秒でループリセットしました (開始位置: ${START_TIME}秒)。`);
            }
        });
        
        // BGMが最後まで再生されたとき (安全策)
        audio.addEventListener('ended', function() {
            audio.currentTime = START_TIME;
            audio.play();
        });
    }

    // BGMの再生を実行
    audio.play()
        .then(() => {
            isPlaying = true;
            updateButtonLabel(true);
            console.log(`BGM再生開始 (ファイル: ${BGM_PATH}, ループ間隔: ${LOOP_DURATION}秒)`);
        })
        .catch(error => {
            console.error("BGMの再生に失敗しました:", error);
            isPlaying = false;
            updateButtonLabel(false);
        });
}

// ----------------------------------------------------
// ★★★ 3. UI/イベントロジック (前回から変更なし) ★★★
// ----------------------------------------------------

function updateButtonLabel(playing) {
    const btn = document.getElementById(BUTTON_ID);
    if (btn) {
        btn.textContent = playing ? 'BGM 停止 ⏸️' : 'BGM 再開 ▶️';
        print(`Button label updated to: ${btn.textContent}`);
    }
}

function toggleBGM() {
    if (!audio) {
        startBGM();
        return;
    }

    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        console.log("BGM一時停止。");
    } else {
        audio.play()
            .then(() => {
                isPlaying = true;
                console.log("BGM再開。");
            })
            .catch(error => {
                console.error("BGM再開に失敗しました:", error);
                isPlaying = false;
            });
    }
    updateButtonLabel(isPlaying);
}

function createControlButton() {
    // 1. CSSの挿入
    const style = document.createElement('style');
    const cssText = `
        #${BUTTON_ID} {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999998;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            transition: background-color 0.2s;
        }
        #${BUTTON_ID}:hover {
            background-color: #45a049;
        }
    `;
    style.textContent = cssText;
    print(`style.textContent (first 50 chars): ${style.textContent.substring(0, 50)}...`);
    document.head.appendChild(style);

    // 2. ボタン要素の作成
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.textContent = 'BGM 再生 ▶️';
    print(`Button created with ID: ${button.id}`);
    
    // 3. クリックイベントリスナーを設定
    button.addEventListener('click', toggleBGM);

    // 4. bodyに挿入
    document.body.appendChild(button);
    console.log("BGM制御ボタンを画面下部に配置しました。");
}


// ----------------------------------------------------
// ★★★ 4. 実行ロジック ★★★
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    console.log("Audioスクリプト起動。クエリパラメータ解析完了。");
    createControlButton();
});
