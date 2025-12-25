// audio.js
// 値の決定時に出力する関数 (ユーザーの指示に従って作成)
function print(value) {
    console.log(value);
}

// ----------------------------------------------------
// ★★★ 1. クエリパラメータの解析関数 ★★★
// ----------------------------------------------------
function getQueryParams() {
    print("Status: クエリパラメータの解析を開始します...");
    const params = {};
    const scripts = document.getElementsByTagName('script');
    let scriptSrc = '';

    // 現在実行中のscriptタグのsrcを探す
    for (const script of scripts) {
        if (script.src.includes('audio.js')) {
            scriptSrc = script.src;
            break;
        }
    }
    print(`scriptSrc: ${scriptSrc}`);
    
    if (scriptSrc) {
        const url = new URL(scriptSrc);
        const urlParams = new URLSearchParams(url.search);
        
        // nameパラメータの取得
        const name = urlParams.get('name');
        if (name) {
            params.name = name.endsWith('.mp3') ? name : `${name}.mp3`;
        } else {
            params.name = 'bgm/another-eden/bgm_デフォルト.mp3';
        }
        print(`params.name: ${params.name}`);

        // s (start time)
        const s = parseFloat(urlParams.get('s'));
        params.start = isNaN(s) || s < 0 ? 0 : s;
        print(`params.start: ${params.start}`);
        
        // e (end time)
        const e = parseFloat(urlParams.get('e'));
        params.duration = isNaN(e) || e <= 0 ? 120 : e; 
        print(`params.duration: ${params.duration}`);
    }
    
    return params;
}

const params = getQueryParams();
const BGM_PATH = params.name ? `/${params.name}` : '/bgm/another-eden/bgm_デフォルト.mp3';
print(`BGM_PATH: ${BGM_PATH}`);

const START_TIME = params.start || 0;
print(`START_TIME: ${START_TIME}`);

const LOOP_DURATION = params.duration || 120;
print(`LOOP_DURATION: ${LOOP_DURATION}`);

// ----------------------------------------------------
// ★★★ 2. 制御ロジック ★★★
// ----------------------------------------------------
let audio; 
let isPlaying = false; 
const BUTTON_ID = 'kakakakakakakakaka_bgm_toggle_btn'; 

function startBGM() {
    if (!audio) {
        print(`Status: Audioオブジェクトを新規作成します。Path: ${BGM_PATH}`);
        audio = new Audio(BGM_PATH);

        audio.currentTime = START_TIME; 
        print(`audio.currentTime initialized to: ${audio.currentTime}`);

        // ループ監視
        audio.addEventListener('timeupdate', function() {
            if (audio.currentTime >= LOOP_DURATION) {
                audio.currentTime = START_TIME;
                audio.play();
                print(`Loop: ${LOOP_DURATION}秒に達したため、${START_TIME}秒に戻しました。`);
            }
        });
        
        audio.addEventListener('ended', function() {
            audio.currentTime = START_TIME;
            audio.play();
            print("Event: 再生終了に伴いループリセットしました。");
        });
    }

    audio.play()
        .then(() => {
            isPlaying = true;
            updateButtonLabel(true);
            print("Action: BGM再生開始成功！");
        })
        .catch(error => {
            print(`Error: 再生に失敗しました。ユーザー操作が必要です。 ${error}`);
            isPlaying = false;
            updateButtonLabel(false);
        });
}

// ----------------------------------------------------
// ★★★ 3. UIロジック ★★★
// ----------------------------------------------------

function updateButtonLabel(playing) {
    const btn = document.getElementById(BUTTON_ID);
    if (btn) {
        btn.textContent = playing ? 'BGM 停止 ⏸️' : 'BGM 再開 ▶️';
        print(`Button UI updated: ${btn.textContent}`);
    }
}

function toggleBGM() {
    print("Action: ユーザーがトグルボタンをクリックしました。");
    if (!audio) {
        startBGM();
        return;
    }

    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        print("Status: BGMを一時停止しました。");
    } else {
        audio.play()
            .then(() => {
                isPlaying = true;
                print("Status: BGMを再開しました。");
            })
            .catch(error => {
                print(`Error: 再開失敗。 ${error}`);
            });
    }
    updateButtonLabel(isPlaying);
}

function createControlButton() {
    print("Status: コントロールボタンを作成します...");
    const style = document.createElement('style');
    style.textContent = `
        #${BUTTON_ID} {
            position: fixed; bottom: 20px; left: 50%;
            transform: translateX(-50%); z-index: 9999998;
            padding: 10px 20px; background-color: #4CAF50;
            color: white; border: none; border-radius: 5px;
            cursor: pointer; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.textContent = 'BGM 再生 ▶️';
    button.addEventListener('click', toggleBGM);
    document.body.appendChild(button);
    print(`Result: ボタン(ID: ${BUTTON_ID})を配置完了！`);
}

// ----------------------------------------------------
// ★★★ 4. 実行 ★★★
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    print("Mission: Audioスクリプトを起動します！🫡");
    createControlButton();
});
