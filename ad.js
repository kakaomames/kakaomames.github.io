// ad.js
// 1. 値の決定時に出力する関数
function print(value) {
    console.log(value);
}

// ★★★ プレフィックスの定義 ★★★
const UNIQUE_PREFIX = 'kakakakakakakakaka'; 
print(`UNIQUE_PREFIX: ${UNIQUE_PREFIX}`);

// 2. 広告の内容を定義
const adContent = {
    title: "📝 回答をお願いします！",
    text: "！！",
    link: "https://forms.gle/NmGdR1cabCNLjV6dA", 
    buttonText: "アンケートに回答する 🚀"
};

print(`adContent.title: ${adContent.title}`);
print(`adContent.text: ${adContent.text}`);
print(`adContent.link: ${adContent.link}`);

// CSSを注入する関数
function injectCSS() {
    print("Status: CSSの注入を開始します...");
    const style = document.createElement('style');
    
    // クラス名の変数を決定
    const mock = `.${UNIQUE_PREFIX}ad-mock-js`;
    const close = `.${UNIQUE_PREFIX}ad-close-btn`;
    const label = `.${UNIQUE_PREFIX}ad-label-js`;
    const title = `.${UNIQUE_PREFIX}ad-title-js`;
    const text = `.${UNIQUE_PREFIX}ad-text-js`;
    const button = `.${UNIQUE_PREFIX}ad-button-js`;
    const dummy = `.${UNIQUE_PREFIX}dummy-content`;

    style.textContent = `
        ${mock} {
            position: fixed; top: 20px; right: 20px; z-index: 9999999; 
            width: 280px; padding: 20px; border: 4px solid #d32f2f;
            border-radius: 15px; background-color: #ffffff;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4); text-align: center;
            transition: all 0.4s ease; position: relative;
        }
        ${mock}:hover { transform: scale(1.05); }
        ${close} {
            position: absolute; top: 5px; right: 10px; font-size: 20px;
            font-weight: bold; color: #d32f2f; cursor: pointer;
        }
        ${label} { color: #d81b60; font-size: 15px; font-weight: bold; margin-bottom: 10px; }
        ${title} { color: #c62828; font-size: 24px; margin: 5px 0 15px 0; }
        ${text} { color: #555555; font-size: 16px; margin-bottom: 20px; }
        ${button} {
            display: inline-block; padding: 10px 20px; background-color: #ffb300;
            color: black; text-decoration: none; border-radius: 30px;
            font-weight: bold; box-shadow: 0 4px #ff8f00;
        }
        ${dummy} { padding: 20px; border: 1px dashed #ccc; opacity: 0.7; }
    `;
    
    document.head.appendChild(style);
    print("Result: CSSの注入が完了しました！");
}

// 広告要素を作成する関数
function createAdElement() {
    print("Status: 広告要素の生成を開始します...");
    const adContainer = document.createElement('div');
    adContainer.id = `${UNIQUE_PREFIX}ad-mock-container`; 
    adContainer.className = `${UNIQUE_PREFIX}ad-mock-js`;
    print(`adContainer.id: ${adContainer.id}`);

    const closeButton = document.createElement('span');
    closeButton.className = `${UNIQUE_PREFIX}ad-close-btn`;
    closeButton.textContent = '×';
    closeButton.onclick = function() {
        adContainer.style.display = 'none';
        print("Action: 広告を閉じました。");
    };
    adContainer.appendChild(closeButton);

    const adLabel = document.createElement('p');
    adLabel.className = `${UNIQUE_PREFIX}ad-label-js`;
    adLabel.textContent = '【PR】アンケートにご協力ください';
    adContainer.appendChild(adLabel);

    const adTitle = document.createElement('h2');
    adTitle.className = `${UNIQUE_PREFIX}ad-title-js`;
    adTitle.textContent = adContent.title;
    adContainer.appendChild(adTitle);

    const adText = document.createElement('p');
    adText.className = `${UNIQUE_PREFIX}ad-text-js`;
    adText.textContent = adContent.text;
    adContainer.appendChild(adText);

    const adLink = document.createElement('a');
    adLink.className = `${UNIQUE_PREFIX}ad-button-js`;
    adLink.href = adContent.link;
    adLink.textContent = adContent.buttonText;
    adLink.target = '_blank';
    adContainer.appendChild(adLink);

    document.body.appendChild(adContainer);
    print("Result: 広告要素の追加が完了しました！");
}

// ダミーコンテンツの生成
function addDummyContent() {
    print("Status: ダミーコンテンツを生成します...");
    for (let i = 1; i <= 5; i++) { // 動作確認のため一旦5個に減らしています
        const dummyDiv = document.createElement('div');
        dummyDiv.className = `${UNIQUE_PREFIX}dummy-content`;
        dummyDiv.innerHTML = `<h3>コンテンツ #${i}</h3><p>テスト用ダミーテキスト</p>`;
        document.body.appendChild(dummyDiv);
    }
    print("Result: ダミーコンテンツの生成が完了しました！");
}

// 🚀 実行のコントロール
// DOMがすでに読み込まれているかチェックし、即座に実行するかイベントを待つ
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        injectCSS();
        addDummyContent();
        createAdElement();
    });
} else {
    // すでに読み込み済みの場合（async/deferなど）
    injectCSS();
    addDummyContent();
    createAdElement();
}
