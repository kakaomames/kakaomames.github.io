// audio.js
// 値の決定時に出力する関数 (ユーザーの指示に従って作成)
function print(value) {
    console.log(value);
}

const BGM_PATH = '/bgm_emotive.mp3';
print(`BGM_PATH: ${BGM_PATH}`);
const LOOP_DURATION = 119; // ループ間隔 (秒)
print(`LOOP_DURATION: ${LOOP_DURATION}`);

let audio; // Audioオブジェクトを保持するための変数
let isPlaying = false; // 現在再生中かどうかの状態を保持
const BUTTON_ID = 'kakakakakakakakaka_bgm_toggle_btn'; // 広告と干渉しないユニークID

/**
 * BGMの再生を開始し、120秒ごとにループさせる
 */
function startBGM() {
    if (!audio) {
        audio = new Audio(BGM_PATH);
        print(`audio: ${audio}`);

        // 再生時間の監視を設定
        audio.addEventListener('timeupdate', function() {
            // 現在の再生時間が120秒を超えたら、0秒に戻して再開
            if (audio.currentTime >= LOOP_DURATION) {
                audio.currentTime = 0;
                audio.play();
                console.log(`BGMを${LOOP_DURATION}秒でループリセットしました。`);
            }
        });
        
        // BGMが最後まで再生されたとき (120秒制限で基本的に到達しないが、安全策として)
        audio.addEventListener('ended', function() {
            audio.currentTime = 0;
            audio.play();
        });
    }

    // BGMの再生を実行
    audio.play()
        .then(() => {
            isPlaying = true;
            updateButtonLabel(true);
            console.log("BGM再生開始 (120秒間隔ループ)");
        })
        .catch(error => {
            // ブラウザの制限などで再生がブロックされた場合
            console.error("BGMの再生に失敗しました:", error);
            console.error("💡 ヒント: ユーザー操作がないため再生がブロックされました。ボタンをクリックしてください。");
            isPlaying = false;
            updateButtonLabel(false);
        });
}

/**
 * 再生状態に基づいてボタンのラベルを更新する
 * @param {boolean} playing - 現在再生中かどうか
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
        // audioオブジェクトがまだ作成されていなければ、ここで作成して再生開始
        startBGM();
        return;
    }

    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        console.log("BGM一時停止。");
    } else {
        // pause()で止まっているだけなので、play()で再開
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
    // 1. CSSの挿入 (干渉を避けるため、独自のIDセレクタを使用)
    const style = document.createElement('style');
    print(`style: ${style}`);
    
    // ユニークIDセレクタを使って他のCSSとの干渉を避ける
    const cssText = `
        #${BUTTON_ID} {
            position: fixed;
            bottom: 20px; /* 画面下部に固定 */
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999998; /* 広告よりは下、他のページ要素よりは上に配置 */
            
            padding: 10px 20px;
            background-color: #4CAF50; /* 緑色のボタン */
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
    button.textContent = 'BGM 再生 ▶️'; // 初期ラベル
    print(`Button created with ID: ${button.id}`);
    
    // 3. クリックイベントリスナーを設定
    button.addEventListener('click', toggleBGM);

    // 4. bodyに挿入
    document.body.appendChild(button);
    console.log("BGM制御ボタンを画面下部に配置しました。");
}


// 旗が押された時 (ページ読み込み完了時)
document.addEventListener('DOMContentLoaded', function() {
    console.log("Audioスクリプト起動。");

    // 制御ボタンを最初に作成して配置
    createControlButton();
});
