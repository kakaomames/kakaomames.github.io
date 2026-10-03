// 💡 引数としてファイル名（'index.txt' など）を受け取る関数
async function domSousa(fileName) {
    // 先ほど追加したアラート
    alert("Hello");

    try {
        // 引数で受け取ったファイル名を使ってfetchする
        let res = await fetch(fileName); 
        if (!res.ok) throw new Error(`${fileName} の取得に失敗しました`);

        let nextDomText = await res.text();

        // 画面全体を新しいHTMLで上書き
        document.open();
        document.write(nextDomText);
        document.close();

    } catch (error) {
        console.error("エラーが発生しました:", error);
        alert("ページの切り替えに失敗しました。");
    }
}
