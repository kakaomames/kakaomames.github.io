// Vercel Flask APIの認証ステータスチェックエンドポイント
const AUTH_STATUS_URL = "https://xeroxapp040.vercel.app/api/auth/status";

/**
 * ログイン状態をチェックし、ヘッダーのUIを更新する
 */
async function updateAuthStatus() {
    const authContainer = document.getElementById('auth-status-container');
    if (!authContainer) return; // コンテナがない場合は処理しない

    try {
        // 🌟 重要なポイント: credentials: 'include' でセッションクッキーを送信 🌟
        const response = await fetch(AUTH_STATUS_URL, {
            method: 'GET',
            credentials: 'include' 
        });

        const data = await response.json();

        if (data.logged_in) {
            // ログイン済みの場合
            const username = data.username || 'プレイヤー';
            const profileImgUrl = data.profile_img || 'https://dummyimage.com/40x40/007bff/fff&text=👤';
            
            // UIをユーザー情報に切り替える
            authContainer.innerHTML = `
                <div style="display: flex; align-items: center; color: white;">
                    <img src="${profileImgUrl}" alt="${username}のプロフィール" 
                         style="width: 32px; height: 32px; border-radius: 50%; margin-right: 8px;">
                    <span style="font-weight: 500;">${username}</span>
                </div>
            `;
            
            // ログインリンク（login.html, signin.html）を非表示にするなどの処理を追加
            
        } else {
            // 未ログインの場合
            // index.htmlで作成したデフォルトのHTMLを残すか、ここで再挿入する
            authContainer.innerHTML = `
                <a id="login-link" href="login.html" 
                   style="padding: 8px 16px; background-color: #3f3f3f; color: #fff; text-decoration: none; border-radius: 2px;">
                   ログイン / 登録
                </a>
            `;
        }

    } catch (error) {
        console.error("認証ステータスのチェックに失敗しました:", error);
        // エラーが発生してもUIはデフォルト（未ログイン）のままにする
    }
}

// ページがロードされたら実行
document.addEventListener('DOMContentLoaded', updateAuthStatus);
