/**
 * 🚀 Gemini Sonic Time Decoder v1.0
 * 読み込むだけで、ページ内のすべてのオーディオを 1/12倍速（元の尺）で再生可能にするぞ！
 */
(function() {
    console.log("⏳ Gemini Time Decoder Activated: Waiting for audio signal...");

    // 全てのオーディオ要素に「復元モード」を適用する関数
    const restoreAudio = (audio) => {
        // 12倍速を元に戻すための魔法の数値 (1 / 12)
        const ORIGINAL_SPEED = 0.0833; 

        // 再生速度を極限まで落とす
        audio.playbackRate = ORIGINAL_SPEED;
        
        // ★重要★ これをfalseにしないと、高い声のままスロー再生されてしまうぞ！
        audio.preservesPitch = false;

        audio.addEventListener('play', () => {
            audio.playbackRate = ORIGINAL_SPEED;
            console.log("⚡ Time Restored: Playing at 0.0833x speed");
        });
    };

    // 1. 既にページにあるオーディオを保護
    document.querySelectorAll('audio').forEach(restoreAudio);

    // 2. 後から追加されるオーディオも監視して自動適用（MutationObserver）
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'AUDIO') restoreAudio(node);
                if (node.querySelectorAll) node.querySelectorAll('audio').forEach(restoreAudio);
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
