// ad.js
// 値の決定時に出力する関数 (ユーザーの指示に従って作成)
function print(value) {
    console.log(value);
}

// ★★★ ページ干渉防止のためのユニークプレフィックスを定義 ★★★
const UNIQUE_PREFIX = 'kakakakakakakakaka'; 
print(`UNIQUE_PREFIX: ${UNIQUE_PREFIX}`);

// 広告の内容を定義するオブジェクト
const adContent = {
    title: "📝 回答をお願いします！",
    text: "！！",
    link: "https://forms.gle/NmGdR1cabCNLjV6dA", 
    buttonText: "アンケートに回答する 🚀"
};

print(`adContent.title: ${adContent.title}`);
print(`adContent.text: ${adContent.text}`);
print(`adContent.link: ${adContent.link}`);

// 1. CSSスタイルの定義と適用 (セレクタにプレフィックスを適用)
function injectCSS() {
    const style = document.createElement('style');
    print(`style: ${style}`);
    
    // プレフィックスを適用したクラス名を作成
    const mock = `.${UNIQUE_PREFIX}ad-mock-js`;
    const close = `.${UNIQUE_PREFIX}ad-close-btn`;
    const label = `.${UNIQUE_PREFIX}ad-label-js`;
    const title = `.${UNIQUE_PREFIX}ad-title-js`;
    const text = `.${UNIQUE_PREFIX}ad-text-js`;
    const button = `.${UNIQUE_PREFIX}ad-button-js`;
    const dummy = `.${UNIQUE_PREFIX}dummy-content`;

    // body要素自体へのスタイルは広告の表示位置にのみ影響するため、
    // 干渉の度合いが低いもの（display: blockなど）のみ使用します。
    // bodyスタイルを削除または最小限にすることで干渉リスクを下げます。
    const cssText = `
        /* ★ bodyへの影響を最小限にするため、一部スタイルを削除/調整 ★ */
        body {
            /* ページレイアウトに影響する display/align-items は削除し、パディングのみ残します */
            padding: 50px; 
            margin: 0;
            background-color: #e3f2fd; /* 背景色はそのまま */
            font-family: 'Verdana', sans-serif;
        }

        /* ★★★ 広告コンテナのスタイル (プレフィックス適用) ★★★ */
        ${mock} {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999999; 
            
            width: 280px;
            padding: 20px;
            border: 4px solid #d32f2f;
            border-radius: 15px;
            background-color: #ffffff;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
            text-align: center;
            transition: all 0.4s ease;
            position: relative;
        }

        ${mock}:hover {
            transform: scale(1.05);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.5);
        }
        
        /* ★★★ 閉じるボタンのスタイル (プレフィックス適用) ★★★ */
        ${close} {
            position: absolute;
            top: 5px;
            right: 10px;
            font-size: 20px;
            font-weight: bold;
            color: #d32f2f;
            cursor: pointer;
            padding: 0 5px;
            line-height: 1;
            transition: color 0.2s;
        }

        ${close}:hover {
            color: #ff0000;
            transform: rotate(10deg);
        }

        /* ★★★ 各要素のスタイル (プレフィックス適用) ★★★ */
        ${label} {
            color: #d81b60;
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        ${title} {
            color: #c62828;
            font-size: 24px;
            margin-top: 5px;
            margin-bottom: 15px;
        }

        ${text} {
            color: #555555;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.4;
        }

        ${button} {
            display: inline-block;
            padding: 10px 20px;
            background-color: #ffb300;
            color: black;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            font-size: 16px;
            transition: background-color 0.2s, transform 0.1s;
            box-shadow: 0 4px #ff8f00;
        }

        ${button}:hover {
            background-color: #ff8f00;
        }

        ${button}:active {
            transform: translateY(2px);
            box-shadow: 0 2px #ff8f00;
        }

        /* ★★★ ダミーコンテンツのスタイル (プレフィックス適用) ★★★ */
        ${dummy} {
            padding: 20px;
            margin-bottom: 20px;
            background-color: #ffffff;
            border: 1px dashed #cccccc;
            opacity: 0.7;
        }
    `;
    
    style.textContent = cssText;
    print(`style.textContent (first 50 chars): ${style.textContent.substring(0, 50)}...`);
    document.head.appendChild(style);
}


// 2. HTML要素の作成と内容の設定 (クラス名/ID名にプレフィックスを適用)
function createAdElement() {
    // 親コンテナの作成
    const adContainer = document.createElement('div');
    // IDとクラス名にプレフィックスを適用！
    adContainer.id = `${UNIQUE_PREFIX}ad-mock-container`; 
    adContainer.className = `${UNIQUE_PREFIX}ad-mock-js`;
    print(`adContainer.id: ${adContainer.id}`);

    // 閉じるボタンの作成とイベント設定
    const closeButton = document.createElement('span');
    closeButton.className = `${UNIQUE_PREFIX}ad-close-btn`; // プレフィックス適用
    closeButton.textContent = '×';

    closeButton.addEventListener('click', function() {
        // IDにプレフィックスを適用！
        const container = document.getElementById(`${UNIQUE_PREFIX}ad-mock-container`);
        if (container) {
            container.style.display = 'none';
            console.log("広告もどきを非表示にしました！");
        }
    });
    adContainer.appendChild(closeButton);

    // PRラベル
    const adLabel = document.createElement('p');
    adLabel.className = `${UNIQUE_PREFIX}ad-label-js`; // プレフィックス適用
    adLabel.textContent = '【PR】アンケートにご協力ください';
    print(`adLabel.textContent: ${adLabel.textContent}`);
    adContainer.appendChild(adLabel);

    // タイトル
    const adTitle = document.createElement('h2');
    adTitle.className = `${UNIQUE_PREFIX}ad-title-js`; // プレフィックス適用
    adTitle.textContent = adContent.title;
    print(`adTitle.textContent: ${adContent.title}`);
    adContainer.appendChild(adTitle);

    // 本文テキスト
    const adText = document.createElement('p');
    adText.className = `${UNIQUE_PREFIX}ad-text-js`; // プレフィックス適用
    adText.textContent = adContent.text;
    print(`adText.textContent: ${adContent.text}`);
    adContainer.appendChild(adText);

    // リンクボタン
    const adLink = document.createElement('a');
    adLink.className = `${UNIQUE_PREFIX}ad-button-js`; // プレフィックス適用
    adLink.href = adContent.link;
    adLink.textContent = adContent.buttonText;
    adLink.target = '_blank';
    print(`adLink.href: ${adContent.link}`);
    print(`adLink.textContent: ${adContent.buttonText}`);
    adContainer.appendChild(adLink);

    // 作成した広告要素を<body>の最後に追加
    document.body.appendChild(adContainer);
}

// 4. ダミーコンテンツの追加関数 (クラス名にプレフィックスを適用)
function addDummyContent() {
    console.log("ダミーコンテンツ生成開始...");
    const dummyText = "これは広告の裏側にあるダミーコンテンツです。ユニークなCSSで他のページと干渉していません。";
    
    for (let i = 1; i <= 20; i++) {
        const dummyDiv = document.createElement('div');
        dummyDiv.className = `${UNIQUE_PREFIX}dummy-content`; // プレフィックス適用
        dummyDiv.innerHTML = `<h3>コンテンツ #${i}</h3><p>${dummyText.repeat(i)}</p>`;
        document.body.appendChild(dummyDiv);
    }
    console.log("ダミーコンテンツ生成完了！");
}


// 3. 実行：DOMContentLoadedを待ってからCSSと要素を挿入
document.addEventListener('DOMContentLoaded', function() {
    console.log("CSS干渉防止スクリプト実行開始！");
    
    addDummyContent(); 
    injectCSS();       
    createAdElement(); 
    
    console.log("広告もどき生成完了！ページへの影響は最小限に抑えられました。");
});
