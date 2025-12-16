// villager_trade_logic.js

const MESSAGE_DIV = document.getElementById('resultMessage');
const JSON_CONTENT_PRE = document.getElementById('jsonContent');
const JSON_OUTPUT_DIV = document.getElementById('jsonOutput');
const TIERS_CONTAINER = document.getElementById('tiersContainer');
const FORM = document.getElementById('villagerTradeForm');
const PROFESSION_SELECT = document.getElementById('profession_id');
const CUSTOM_PROFESSION_INPUT = document.getElementById('custom_profession_id');

let tierCount = 0;
let tradeIdCounter = 0;

// --- 初期化とイベントリスナーの設定 ---
document.addEventListener('DOMContentLoaded', function() {
    // 職業ID選択肢の変更を監視
    PROFESSION_SELECT.addEventListener('change', function() {
        if (this.value === 'CUSTOM_ID_INPUT') {
            CUSTOM_PROFESSION_INPUT.style.display = 'block';
            CUSTOM_PROFESSION_INPUT.required = true;
        } else {
            CUSTOM_PROFESSION_INPUT.style.display = 'none';
            CUSTOM_PROFESSION_INPUT.required = false;
        }
    });

    // 初期ロード時にティアレベル1を追加
    addTierGroup(1);
    document.getElementById('addTierButton').addEventListener('click', () => addTierGroup(TIERS_CONTAINER.children.length + 1));
    
    // フォーム送信ロジック
    FORM.addEventListener('submit', handleFormSubmit);
});

// --- 動的要素操作関数 ---

/**
 * 新しい取引入力グループ (個別取引) を動的に追加する関数
 */
function addTradeItem(tierId) {
    tradeIdCounter++;
    const tradeId = `trade_item_${tradeIdCounter}`;
    const tierGroup = document.getElementById(tierId);
    const tradeItemDiv = document.createElement('div');
    tradeItemDiv.className = 'trade-item';
    tradeItemDiv.id = tradeId;
    
    tradeItemDiv.innerHTML = `
        <div style="font-weight: bold; color: #e74c3c;">個別取引 #${tierGroup.querySelectorAll('.trade-item').length + 1}</div>
        
        <div class="trade-inputs">
            <div>
                <label>必要アイテム A ID <span style="color: red;">*</span></label>
                <input type="text" class="need_id_a" placeholder="例: minecraft:emerald">
                <label>必要アイテム A 数量 (Min/Max)</label>
                <div class="count-group">
                    <input type="number" class="need_count_a_min" value="1" min="1" placeholder="Min">
                    <input type="number" class="need_count_a_max" value="1" min="1" placeholder="Max">
                </div>
            </div>
            <div>
                <label>必要アイテム B ID (オプション)</label>
                <input type="text" class="need_id_b" placeholder="例: myaddon:custom_item">
                <label>必要アイテム B 数量 (Min/Max)</label>
                <div class="count-group">
                    <input type="number" class="need_count_b_min" value="0" min="0" placeholder="Min">
                    <input type="number" class="need_count_b_max" value="0" min="0" placeholder="Max">
                </div>
            </div>
            <div>
                <label>結果アイテム ID <span style="color: red;">*</span></label>
                <input type="text" class="result_id" placeholder="例: minecraft:diamond_sword">
                <label>結果アイテム 数量 (Min/Max)</label>
                <div class="count-group">
                    <input type="number" class="result_count_min" value="1" min="1" placeholder="Min">
                    <input type="number" class="result_count_max" value="1" min="1" placeholder="Max">
                </div>
            </div>
        </div>

        <div class="advanced-options">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <label>最大取引回数 (Max Times)</label>
                    <input type="number" class="max_times" value="12" min="1" style="width: 100px;">
                </div>
                <div>
                    <label>取引で得られる経験値</label>
                    <input type="number" class="trades_exp" value="1" min="0" style="width: 100px;">
                </div>
                <button type="button" class="remove-trade-btn" onclick="window.removeElement('${tradeId}')" style="margin-top: 0;">削除</button>
            </div>

            <div class="enchant-group">
                <span style="font-weight: bold; color: #9b59b6;">✨ 結果アイテムにエンチャントを追加 (オプション)</span>
                <div style="display: flex; gap: 15px;">
                    <div style="flex-grow: 1;">
                        <label>エンチャントレベル Min</label>
                        <input type="number" class="enchant_min" value="0" min="0">
                    </div>
                    <div style="flex-grow: 1;">
                        <label>エンチャントレベル Max</label>
                        <input type="number" class="enchant_max" value="0" min="0">
                    </div>
                    <div style="flex-shrink: 0; width: 100px;">
                        <label>宝エンチャント (Treasure)</label>
                        <select class="enchant_treasure">
                            <option value="false">含めない (false)</option>
                            <option value="true">含める (true)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const tradesContainer = tierGroup.querySelector('.trades-container');
    tradesContainer.appendChild(tradeItemDiv); 
    renumberTradeItems(tierId);
}

/**
 * 新しい取引レベル (ティア) グループを動的に追加する関数
 */
function addTierGroup(initialLevel = 1) {
    tierCount++;
    const tierId = `tier_group_${tierCount}`;
    const group = document.createElement('div');
    group.className = 'tier-group';
    group.id = tierId;
    
    group.innerHTML = `
        <h2>
            取引レベル (ティア) #${tierCount}
            <button type="button" class="remove-tier-btn" onclick="window.removeElement('${tierId}')">ティアを削除</button>
        </h2>
        
        <label for="tier_level_${tierId}">**取引レベル (1=見習い, 5=マスター)** <span style="color: red;">*</span></label>
        <input type="number" class="tier_level" id="tier_level_${tierId}" value="${initialLevel}" min="1" max="5" required>
        
        <hr style="margin: 15px 0;">

        <div class="trades-container">
            </div>

        <button type="button" class="add-trade-btn" onclick="addTradeItem('${tierId}')">+ このティアに個別取引を追加</button>
    `;
    
    TIERS_CONTAINER.appendChild(group);
    addTradeItem(tierId); 
}

/**
 * 任意の要素を削除し、取引番号を振り直す
 */
window.removeElement = function(id) {
    const element = document.getElementById(id);
    if (element) {
        const parentTier = element.closest('.tier-group');
        element.remove();
        
        if (parentTier) {
            renumberTradeItems(parentTier.id);
        }
        
        if (TIERS_CONTAINER.children.length === 0) {
             addTierGroup(1);
        }
    }
};

/**
 * 個別取引の番号を振り直す関数
 */
function renumberTradeItems(tierId) {
    const tierGroup = document.getElementById(tierId);
    if (!tierGroup) return;

    const tradeItems = tierGroup.querySelectorAll('.trade-item');
    tradeItems.forEach((item, index) => {
        item.querySelector('div[style*="font-weight"]').textContent = `個別取引 #${index + 1}`;
    });
}

// --- フォーム送信ロジック ---

function handleFormSubmit(e) {
    e.preventDefault(); 
    
    MESSAGE_DIV.style.display = 'none';
    JSON_OUTPUT_DIV.style.display = 'none';

    // 1. 職業IDの決定
    const selectedProfession = PROFESSION_SELECT.value;
    let finalProfessionId = '';

    if (selectedProfession === 'CUSTOM_ID_INPUT') {
        finalProfessionId = CUSTOM_PROFESSION_INPUT.value.trim();
        if (!finalProfessionId) {
             MESSAGE_DIV.style.display = 'block';
             MESSAGE_DIV.className = 'message error';
             MESSAGE_DIV.innerHTML = '❌ エラー: カスタム職業IDを入力してください。';
             return;
        }
    } else if (selectedProfession) {
        finalProfessionId = selectedProfession;
    } else {
        MESSAGE_DIV.style.display = 'block';
        MESSAGE_DIV.className = 'message error';
        MESSAGE_DIV.innerHTML = '❌ エラー: 村人の職業を選択してください。';
        return;
    }

    const tierNameBase = document.getElementById('tier_name_base').value.trim();
    if (!tierNameBase) {
         MESSAGE_DIV.style.display = 'block';
         MESSAGE_DIV.className = 'message error';
         MESSAGE_DIV.innerHTML = '❌ エラー: ファイル名ベースのティア名は必須です。';
         return;
    }
    
    let tiersList = [];
    let hasError = false;
    const tierGroups = TIERS_CONTAINER.querySelectorAll('.tier-group');
    if (tierGroups.length === 0) {
         MESSAGE_DIV.style.display = 'block';
         MESSAGE_DIV.className = 'message error';
         MESSAGE_DIV.innerHTML = '❌ エラー: 最低1つの取引レベル (ティア) を定義してください。';
         return;
    }
    const usedLevels = new Set(); 

    tierGroups.forEach((tierGroup, tierIndex) => {
        const tierLevel = parseInt(tierGroup.querySelector('.tier_level').value.trim());
        
        if (isNaN(tierLevel) || tierLevel < 1 || tierLevel > 5 || usedLevels.has(tierLevel)) {
            if (usedLevels.has(tierLevel)) {
                MESSAGE_DIV.innerHTML = `❌ エラー: 取引レベル ${tierLevel} は既に定義されています。重複は許可されません。`;
            } else {
                MESSAGE_DIV.innerHTML = `❌ エラー: 取引レベル #${tierIndex + 1} は1〜5の数値で入力してください。`;
            }
            MESSAGE_DIV.style.display = 'block';
            MESSAGE_DIV.className = 'message error';
            hasError = true;
            return;
        }
        usedLevels.add(tierLevel);

        const tradeItems = tierGroup.querySelectorAll('.trade-item');
        let tradeList = [];
        
        tradeItems.forEach((item, tradeIndex) => {
            const needIdA = item.querySelector('.need_id_a').value.trim();
            const needMinA = parseInt(item.querySelector('.need_count_a_min').value.trim());
            const needMaxA = parseInt(item.querySelector('.need_count_a_max').value.trim());

            const needIdB = item.querySelector('.need_id_b').value.trim();
            const needMinB = parseInt(item.querySelector('.need_count_b_min').value.trim());
            const needMaxB = parseInt(item.querySelector('.need_count_b_max').value.trim());

            const resultId = item.querySelector('.result_id').value.trim();
            const resultMin = parseInt(item.querySelector('.result_count_min').value.trim());
            const resultMax = parseInt(item.querySelector('.result_count_max').value.trim());

            const maxTimes = parseInt(item.querySelector('.max_times').value.trim());
            const tradesExp = parseInt(item.querySelector('.trades_exp').value.trim());
            
            const enchantMin = parseInt(item.querySelector('.enchant_min').value.trim());
            const enchantMax = parseInt(item.querySelector('.enchant_max').value.trim());
            const enchantTreasure = item.querySelector('.enchant_treasure').value === 'true';

            if (!needIdA || !resultId) {
                MESSAGE_DIV.style.display = 'block';
                MESSAGE_DIV.className = 'message error';
                MESSAGE_DIV.innerHTML = `❌ エラー: レベル ${tierLevel} の取引 #${tradeIndex + 1} の必須アイテムIDが不足しています。`;
                hasError = true;
                return;
            }
            if (needMinA > needMaxA || resultMin > resultMax || enchantMin > enchantMax) {
                 MESSAGE_DIV.style.display = 'block';
                 MESSAGE_DIV.className = 'message error';
                 MESSAGE_DIV.innerHTML = `❌ エラー: レベル ${tierLevel} の取引 #${tradeIndex + 1} の数量またはエンチャントの Min/Max の設定が不正です。`;
                 hasError = true;
                 return;
            }
            
            // --- 取引アイテムの構築 (数量ランダム化対応) ---
            let wants = [];
            let gives = [];
            
            // 必須アイテム A
            let itemA = { "item": needIdA };
            if (needMinA !== needMaxA) {
                itemA.quantity = { "min": needMinA, "max": needMaxA };
            } else {
                itemA.count = needMinA; 
            }
            wants.push(itemA);

            // オプションアイテム B
            if (needIdB && (needMinB > 0 || needMaxB > 0)) {
                let itemB = { "item": needIdB };
                if (needMinB !== needMaxB) {
                    itemB.quantity = { "min": needMinB, "max": needMaxB };
                } else {
                    itemB.count = needMinB;
                }
                wants.push(itemB);
            }

            // 結果アイテム
            let resultItem = { "item": resultId };
            if (resultMin !== resultMax) {
                resultItem.quantity = { "min": resultMin, "max": resultMax };
            } else {
                resultItem.count = resultMin;
            }

            // --- エンチャントの追加 (functions) ---
            if (enchantMax > 0) {
                resultItem.functions = [{
                    "function": "enchant_with_levels",
                    "treasure": enchantTreasure,
                    "levels": {
                        "min": enchantMin,
                        "max": enchantMax
                    }
                }];
            }
            gives.push(resultItem);
            
            // --- 取引全体の構築 ---
            let trade = {
                "wants": wants,
                "gives": gives,
                "max_times": maxTimes,
                "trades_exp": tradesExp
            };

            tradeList.push(trade);
        });
        
        if (!hasError) {
             tiersList.push({ "level": tierLevel, "trades": tradeList });
        }
    });

    if (hasError) return;
    
    let villagerData = { "tiers": tiersList };
    const jsonString = JSON.stringify(villagerData, null, 4);
    
    // 5. ファイル名決定とダウンロード
    const fileNameBase = finalProfessionId.split(':').pop();
    const fileName = `${fileNameBase}_${tierNameBase}.json`;
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    MESSAGE_DIV.style.display = 'block';
    MESSAGE_DIV.className = 'message'; 
    MESSAGE_DIV.innerHTML = `✅ 村人取引JSONファイル **${fileName}** のダウンロードを開始しました！<br>高度な数量とエンチャント設定が反映されています。`;
    
    JSON_CONTENT_PRE.textContent = jsonString;
    JSON_OUTPUT_DIV.style.display = 'block';
}

// Global functions exposed to HTML (onclick)
window.addTradeItem = addTradeItem;
window.addTierGroup = addTierGroup;
// window.removeElement is defined inside
