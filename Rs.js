/**
 * HTMLと名前を渡し、実行するとDOMが切り替わる関数を R.js の空きスロットに登録する
 * @param {string} htmlContent - 挿入したいHTML文字列
 * @param {string} name - ログ出力や識別用の名前
 * @returns {number} 登録されたインデックス番号
 */
function DomHtml(htmlContent, name) {
    // 1. _ 配列の中で undefined または null の最小のインデックスを探す
    let targetIndex = 0;
    while (_[targetIndex] !== undefined && _[targetIndex] !== null) {
        targetIndex++;
    }

    // 2. DOMを切り替える関数を作成
    // この関数自体が _[targetIndex] に格納される
    const domSwitcher = function(extraData) {
        // 現在のHTML（変更前）を少し保持してログに活用
        const oldTitle = document.title;

        // 基本的に中身を入れ替える処理
        document.body.innerHTML = htmlContent;
        
        // ログ出力（値が変わったのでミッションログ！）
        // 隊長の指示通り、値が変わったタイミングでログを飛ばします！
        missionLog("DOM_CHANGE", `${name} (Index: ${targetIndex}) に画面が切り替わりました！`, {
            from: oldTitle,
            extra: extraData
        });
        
        // メタタグのロゴとかも再セット（Gemiprocraftの象徴ですからね！）
        updateMetaTags("https://kakaomames.github.io/rei/logo.png");

        // ページ遷移風のイベントリスナーも必要ならここで再設定できますね
        // document.addEventListener('click', ... ); 
    };

    // 3. R.js の配列(Rs関数)を使って登録
    // R.js で定義した Rs(index, object) を利用
    Rs(targetIndex, domSwitcher);
    
    missionLog("SYSTEM", `モジュール「${name}」を R.js のスロット _[${targetIndex}] にインストール完了！`);
    
    return targetIndex;
}
