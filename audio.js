// audio.js (クエリパラメータ対応版)
// 値の決定時に出力する関数 (ユーザーの指示に従って作成)
function print(value) {
    console.log(value);
}

// ----------------------------------------------------
// ★★★ BGMパスの動的決定 ★★★
// ----------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
print(`window.location.search: ${window.location.search}`);

// スクリプトタグのURLではなく、ページ全体のURLからパラメータを読み取っています。
// ※スクリプトタグ自身のURLを取得するには、DOMを走査する複雑な処理が必要になるため、
//   ページURLのパラメータを使用することを想定します。

let bgmFileName = urlParams.get('name');

// audio.jsに直接クエリパラメータを付けた場合、以下の処理でファイル名を正確に取得します。
// （より確実な方法として、読み込まれたスクリプトタグ自身を特定します）
const currentScript = document.currentScript;
print(`currentScript: ${currentScript}`);

if (currentScript) {
    const scriptUrlParams = new URLSearchParams(currentScript.src.split('?')[1]);
    bgmFileName = scriptUrlParams.get('name');
    print(`Script URL Param 'name': ${bgmFileName}`);
}

// ファイル名が取得できたら、パスを決定
let BGM_PATH = bgmFileName ? `/${bgmFileName}.mp3` : '/bgm_default.mp3'; // デフォルトファイルを用意
if (bgmFileName && bgmFileName.endsWith('.mp3')) {
    BGM_PATH = `/${bgmFileName}`; // 拡張子が既に付いていたらそのまま使用
}

print(`BGM_PATH: ${BGM_PATH}`);
// ----------------------------------------------------
// ★★★ BGMパスの動的決定 ここまで ★★★
// ----------------------------------------------------


const LOOP_DURATION = 120; // ループ間隔 (秒)
print(`LOOP_DURATION: ${LOOP_DURATION}`);

let audio; 
let isPlaying = false; 
const BUTTON_ID = 'kakakakakakakakaka_bgm_toggle_btn';

/**
 * BGMの再生を開始し、120秒ごとにループさせる
 */
function startBGM() {
    if (!audio) {
        audio = new Audio(BGM_PATH); // ★ BGM_PATH が動的に決定される
        print(`audio: ${audio}`);

        // 再生時間の監視を設定
        audio.addEventListener('timeupdate', function() {
            if (audio.currentTime >= LOOP_DURATION) {
                audio.currentTime = 0;
                audio.play();
                console.log(`BGMを${LOOP_DURATION}秒でループリセットしました。`);
            }
        });
        
        audio.addEventListener('ended', function() {
            audio.currentTime = 0;
            audio.play();
        });
    }

    audio.play()
        .then(() => {
            isPlaying = true;
            updateButtonLabel(true);
            console.log(`BGM再生開始: ${BGM_PATH}`);
        })
        .catch(error => {
            console.error("BGMの再生に失敗しました:", error);
            isPlaying = false;
            updateButtonLabel(false);
        });
}

/**
 * 再生状態に基づいてボタンのラベルを更新する
 */
function updateButtonLabel(playing) {
    const btn = document.getElementById(BUTTON_ID);
    if (btn) {
        btn.textContent = playing ? 'BGM 停止 ⏸️' : 'BGM 再開 ▶️';
        print(`Button label updated to: ${btn.textContent}`);
    }
}

/**
 * BGMボタンのクリックハンドラ (再生/一時停止の切り替え)
 */
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

/**
 * 制御ボタンの作成とCSSの挿入
 */
function createControlButton() {
    const style = document.createElement('style');
    print(`style: ${style}`);
    
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

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.textContent = 'BGM 再生 ▶️';
    print(`Button created with ID: ${button.id}`);
    
    button.addEventListener('click', toggleBGM);

    document.body.appendChild(button);
    console.log("BGM制御ボタンを画面下部に配置しました。");
}


// 旗が押された時 (ページ読み込み完了時)
document.addEventListener('DOMContentLoaded', function() {
    console.log("Audioスクリプト起動。");

    // 制御ボタンを最初に作成して配置
    createControlButton();
});
