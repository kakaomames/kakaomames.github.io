/**
 * chunk.js - WE (Web Edition) 地形生成エンジン
 * * @param {number} x - X座標
 * @param {number} z - Z座標
 * @param {string} biome - バイオーム識別子 ("plain", "peak", "highland" など)
 * @returns {Object} {type: バイオーム名, y: 生成される高さ, block: 表面のブロックID}
 */
export function chunk(x, z, biome) {
    let height = 0;
    let blockId = "air";

    // バイオームごとのアルゴリズム判定
    if (biome === "plain") {
        // 平原: 65〜80の範囲でなだらかな起伏
        // (x, z)からシノソイド曲線で高さを算出（仮のノイズ計算）
        height = Math.floor(72 + (Math.sin(x * 0.2) * 4 + Math.cos(z * 0.2) * 4));
        blockId = "grass";
    } else if (biome === "peak") {
        // 山岳: 100〜300のダイナミックな高低差
        height = Math.floor(200 + (Math.sin(x * 0.05) * 50 + Math.cos(z * 0.05) * 50));
        blockId = "stone";
    } else if (biome === "highland") {
        // 高地: 81〜99の中間層
        height = Math.floor(90 + (Math.sin(x * 0.1) * 9));
        blockId = "grass";
    } else {
        // デフォルト設定
        height = 64;
        blockId = "dirt";
        missionLog("WARNING", `未定義のバイオーム: ${biome}。デフォルト値を適用します。`);
    }

    // 返り値の構築
    const result = {
        "type": `${biome}`,
        "y": height,
        "block": blockId
    };

    // 値が確定した瞬間にログを出力！
    missionLog("DATA", `地形データ生成 (${x}, ${z})`, result);

    return result;
}
