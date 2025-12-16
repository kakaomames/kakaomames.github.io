// loot_table_logic.js

const MESSAGE_DIV = document.getElementById('resultMessage');
const JSON_CONTENT_PRE = document.getElementById('jsonContent');
const JSON_OUTPUT_DIV = document.getElementById('jsonOutput');
const POOLS_CONTAINER = document.getElementById('poolsContainer');
const FORM = document.getElementById('lootTableForm');
const ADD_POOL_BUTTON = document.getElementById('addPoolButton');

let poolCount = 0;
let entryIdCounter = 0;

// --- 初期化とイベントリスナーの設定 ---
document.addEventListener('DOMContentLoaded', function() {
    // 初期ロード時に最初のプールを追加
    addPoolGroup();
    
    // プール追加ボタン
    ADD_POOL_BUTTON.addEventListener('click', addPoolGroup);
    
    // フォーム送信ロジック
    FORM.addEventListener('submit', handleFormSubmit);
});

// --- 動的要素操作関数 ---

/**
 * 新しいドロップエントリー (Entry) を動的に追加する関数
 */
function addEntryItem(poolId) {
    entryIdCounter++;
    const entryId = `entry_item_${entryIdCounter}`;
    const poolGroup = document.getElementById(poolId);
    
    const entryItemDiv = document.createElement('div');
    entryItemDiv.className = 'entry-item';
    entryItemDiv.id = entryId;
    
    entryItemDiv.innerHTML = `
        <div style="font-weight: bold; color: #e67e22;">ドロップアイテム #${poolGroup.querySelectorAll('.entry-item').length + 1}</div>
        <div class="entry-inputs">
            <div>
                <label>アイテム ID <span style="color: red;">*</span></label>
                <input type="text" class="item_id" placeholder="例: myaddon:custom_item">
            </div>
            <div>
                <label>ドロップ確率 (Weight) <span style="color: red;">*</span></label>
                <input type="number" class="drop_weight" value="1" min="1">
            </div>
            <div>
                <label>ドロップ数量 (Min/Max)</label>
                <div class="count-group">
                    <input type="number" class="count_min" value="1" min="1" placeholder="Min">
                    <input type="number" class="count_max" value="1" min="1" placeholder="Max">
                </div>
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="window.removeElement('${entryId}', '${poolId}')">アイテムを削除</button>
    `;
    
    const entriesContainer = poolGroup.querySelector('.entries-container');
    entriesContainer.appendChild(entryItemDiv); 
    renumberEntryItems(poolId);
}

/**
 * 新しいドロップ規則 (Pool) グループを動的に追加する関数
 */
function addPoolGroup() {
    poolCount++;
    const poolId = `pool_group_${poolCount}`;
    
    const group = document.createElement('div');
    group.className = 'pool-group';
    group.id = poolId;
    
    group.innerHTML = `
        <h2>
            ドロップ規則 (Pool) #${poolCount}
            <button type="button" class="remove-pool-btn" onclick="window.removeElement('${poolId}')">Poolを削除</button>
        </h2>
        
        <div style="display: flex; gap: 20px;">
            <div style="flex: 1;">
                <label>ドロップ試行回数 (Rolls) Min</label>
                <input type="number" class="rolls_min" value="1" min="1" required>
            </div>
            <div style="flex: 1;">
                <label>ドロップ試行回数 (Rolls) Max</label>
                <input type="number" class="rolls_max" value="1" min="1" required>
            </div>
        </div>

        <h3 style="margin-top: 15px;">ドロップアイテムリスト</h3>
        <div class="entries-container">
            </div>

        <button type="button" class="add-btn" onclick="addEntryItem('${poolId}')" style="background-color: #e67e22;">+ このPoolにアイテムを追加</button>
    `;
    
    POOLS_CONTAINER.appendChild(group);
    addEntryItem(poolId); 
}

/**
 * 任意の要素を削除し、エントリー番号を振り直す
 */
window.removeElement = function(id, parentPoolId = null) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
        
        if (parentPoolId) {
            renumberEntryItems(parentPoolId);
        }
        
        // 全てのプールが削除されたら、最低1つ追加する
        if (id.startsWith('pool_group_') && POOLS_CONTAINER.children.length === 0) {
             addPoolGroup();
        }
    }
};

/**
 * 個別エントリーの番号を振り直す関数
 */
function renumberEntryItems(poolId) {
    const poolGroup = document.getElementById(poolId);
    if (!poolGroup) return;

    const entryItems = poolGroup.querySelectorAll('.entry-item');
    entryItems.forEach((item, index) => {
        item.querySelector('div[style*="font-weight"]').textContent = `ドロップアイテム #${index + 1}`;
    });
}

// --- フォーム送信ロジック ---

function handleFormSubmit(e) {
    e.preventDefault(); 
    
    MESSAGE_DIV.style.display = 'none';
    JSON_OUTPUT_DIV.style.display = 'none';

    const fileNameBase = document.getElementById('file_name').value.trim();
    const lootType = document.getElementById('loot_type').value;

    if (!fileNameBase) {
         MESSAGE_DIV.style.display = 'block';
         MESSAGE_DIV.className = 'message error';
         MESSAGE_DIV.innerHTML = '❌ エラー: ファイル名は必須です。';
         return;
    }
    
    let poolsList = [];
    let hasError = false;

    const poolGroups = POOLS_CONTAINER.querySelectorAll('.pool-group');
    if (poolGroups.length === 0) {
         MESSAGE_DIV.style.display = 'block';
         MESSAGE_DIV.className = 'message error';
         MESSAGE_DIV.innerHTML = '❌ エラー: 最低1つのドロップ規則 (Pool) を定義してください。';
         return;
    }
    
    poolGroups.forEach((poolGroup, poolIndex) => {
        const rollsMin = parseInt(poolGroup.querySelector('.rolls_min').value.trim());
        const rollsMax = parseInt(poolGroup.querySelector('.rolls_max').value.trim());
        
        if (rollsMin > rollsMax || rollsMin < 1) {
            MESSAGE_DIV.style.display = 'block';
            MESSAGE_DIV.className = 'message error';
            MESSAGE_DIV.innerHTML = `❌ エラー: Pool #${poolIndex + 1} の試行回数 (Rolls) の Min/Max の設定が不正です。`;
            hasError = true;
            return;
        }

        const entryItems = poolGroup.querySelectorAll('.entry-item');
        let entriesList = [];
        
        entryItems.forEach((item, entryIndex) => {
            const itemId = item.querySelector('.item_id').value.trim();
            const weight = parseInt(item.querySelector('.drop_weight').value.trim());
            const countMin = parseInt(item.querySelector('.count_min').value.trim());
            const countMax = parseInt(item.querySelector('.count_max').value.trim());

            if (!itemId || isNaN(weight) || weight < 1) {
                MESSAGE_DIV.style.display = 'block';
                MESSAGE_DIV.className = 'message error';
                MESSAGE_DIV.innerHTML = `❌ エラー: Pool #${poolIndex + 1} のアイテム #${entryIndex + 1} の必須項目が不足しているか、Weightが不正です。`;
                hasError = true;
                return;
            }
            if (countMin > countMax || countMin < 1) {
                 MESSAGE_DIV.style.display = 'block';
                 MESSAGE_DIV.className = 'message error';
                 MESSAGE_DIV.innerHTML = `❌ エラー: Pool #${poolIndex + 1} のアイテム #${entryIndex + 1} の数量 Min/Max の設定が不正です。`;
                 hasError = true;
                 return;
            }

            // --- エントリーの構築 ---
            let entry = {
                "type": "item",
                "name": itemId,
                "weight": weight,
                "functions": []
            };

            // Set Count Function
            let countFunction = {
                "function": "set_count",
                "count": countMin === countMax ? countMin : { "min": countMin, "max": countMax }
            };
            
            entry.functions.push(countFunction);
            
            entriesList.push(entry);
        });

        if (hasError) return;
        
        // --- プールの構築 ---
        let pool = {
            "rolls": rollsMin === rollsMax ? rollsMin : { "min": rollsMin, "max": rollsMax },
            "entries": entriesList
        };

        poolsList.push(pool);
    });

    if (hasError) return;
    
    // 4. JSON構造の構築
    let lootTableData = {
        "pools": poolsList
    };
    
    const jsonString = JSON.stringify(lootTableData, null, 4);
    
    // 5. ファイル名決定とダウンロード
    const fileName = `${fileNameBase}.json`;
    
    // BP/loot_tables/[loot_type]/[ファイル名].json
    const filePlacement = `BP/loot_tables/${lootType}/${fileName}`;
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // メッセージとプレビューの表示
    MESSAGE_DIV.style.display = 'block';
    MESSAGE_DIV.className = 'message'; 
    MESSAGE_DIV.innerHTML = `✅ ロートテーブルJSONファイル **${fileName}** のダウンロードを開始しました！<br>このファイルは **${filePlacement}** に配置してください。`;
    
    JSON_CONTENT_PRE.textContent = jsonString;
    JSON_OUTPUT_DIV.style.display = 'block';
}

// Global functions exposed to HTML (onclick)
window.addEntryItem = addEntryItem;
window.addPoolGroup = addPoolGroup;
// window.removeElement is defined inside
