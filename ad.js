// ad.js
// 値の決定時に出力する関数 (ユーザーの指示に従って作成)
function print(value) {
    console.log(value);
}

/**
 * 広告もどき 本体JS (Google Formsリンク適用)
 */

// 広告の内容を定義するオブジェクト
const adContent = {
    // ★★★ 広告内容をGoogle Forms用に修正 ★★★
    title: "📝 カカオマメの質問！",
    text: "ゲームについて、アンケートにご協力をお願いします！",
    link: "https://forms.gle/NmGdR1cabCNLjV6dA", // 👈 指定されたGoogle Forms URL
    buttonText: "アンケートに回答する 🚀"
    // ★★★ 修正ここまで ★★★
};

print(`adContent.title: ${adContent.title}`);
print(`adContent.text: ${adContent.text}`);
print(`adContent.link: ${adContent.link}`);

// 1. CSSスタイルの定義と適用 (前回と変更なし)
function injectCSS() {
    const style = document.createElement('style');
    print(`style: ${style}`);
    
    // スタイルシートをそのまま使用します
    const cssText = `
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #e3f2fd;
            font-family: 'Verdana', sans-serif;
            padding: 50px;
        }

        /* 広告コンテナのスタイル */
        .ad-mock-js {
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

        .ad-mock-js:hover {
            transform: scale(1.05);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.5);
        }
        
        /* 閉じるボタンのスタイル */
        .ad-close-btn {
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

        .ad-close-btn:hover {
            color: #ff0000;
            transform: rotate(10deg);
        }

        .ad-label-js {
            color: #d81b60;
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .ad-title-js {
            color: #c62828;
            font-size: 24px;
            margin-top: 5px;
            margin-bottom: 15px;
        }

        .ad-text-js {
            color: #555555;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.4;
        }

        .ad-button-js {
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

        .ad-button-js:hover {
            background-color: #ff8f00;
        }

        .ad-button-js:active {
            transform: translateY(2px);
            box-shadow: 0 2px #ff8f00;
        }
    `;
    
    style.textContent = cssText;
    print(`style.textContent (first 50 chars): ${style.textContent.substring(0, 50)}...`);
    document.head.appendChild(style);
}

// 2. HTML要素の作成と内容の設定 (リンクとテキストが adContent から自動で設定されます)
function createAdElement() {
    const adContainer = document.createElement('div');
    adContainer.id = 'ad-mock-container';
    adContainer.className = 'ad-mock-js';
    print(`adContainer: ${adContainer}`);

    // 閉じるボタンの作成とイベント設定
    const closeButton = document.createElement('span');
    closeButton.className = 'ad-close-btn';
    closeButton.textContent = '×';

    closeButton.addEventListener('click', function() {
        const container = document.getElementById('ad-mock-container');
        if (container) {
            container.style.display = 'none';
            console.log("広告もどきを非表示にしました！");
        }
    });
    adContainer.appendChild(closeButton);

    // PRラベル
    const adLabel = document.createElement('p');
    adLabel.className = 'ad-label-js';
    adLabel.textContent = '【PR】アンケートにご協力ください';
    print(`adLabel.textContent: ${adLabel.textContent}`);
    adContainer.appendChild(adLabel);

    // タイトル
    const adTitle = document.createElement('h2');
    adTitle.className = 'ad-title-js';
    adTitle.textContent = adContent.title;
    print(`adTitle.textContent: ${adContent.title}`);
    adContainer.appendChild(adTitle);

    // 本文テキスト
    const adText = document.createElement('p');
    adText.className = 'ad-text-js';
    adText.textContent = adContent.text;
    print(`adText.textContent: ${adContent.text}`);
    adContainer.appendChild(adText);

    // リンクボタン
    const adLink = document.createElement('a');
    adLink.className = 'ad-button-js';
    adLink.href = adContent.link;
    adLink.textContent = adContent.buttonText;
    adLink.target = '_blank';
    print(`adLink.href: ${adContent.link}`);
    print(`adLink.textContent: ${adContent.buttonText}`);
    adContainer.appendChild(adLink);

    // 作成した広告要素を<body>の最後に追加
    document.body.appendChild(adContainer);
}

// 3. 実行
document.addEventListener('DOMContentLoaded', function() {
    console.log("Google Formsリンク付き広告スクリプト実行開始！");
    injectCSS(); 
    createAdElement(); 
    console.log("広告もどき生成完了！");
});
