// GitHub Pagesで実行するJavaScriptコード

/**
 * 1. URLパラメータからトークンを取得する
 */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('login_status');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    // トークンが取得できたら、URLをクリーンアップする (トークンをURLに残さないため)
    if (accessToken) {
        // history.replaceStateでURLからクエリパラメータを削除
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    return { status, accessToken, refreshToken };
}

/**
 * 2. VercelのAPIエンドポイントを呼び出し、チャンネル情報を取得する
 * @param {string} token - アクセストークン
 */
async function fetchYouTubeData(token) {
    // あなたのVercelドメインに合わせてURLを修正してください
    const VERCEL_API_URL = 'https://xeroxapp037.vercel.app/api/youtube_channel';
    const apiCallUrl = `${VERCEL_API_URL}?access_token=${token}`;

    try {
        const response = await fetch(apiCallUrl);
        const data = await response.json();

        if (data.status === 'success') {
            console.log("YouTubeデータ取得成功！", data.channel_info);
            // 取得したデータを画面に表示する処理をここに追加
            displayChannelInfo(data.channel_info);
        } else {
            console.error("API呼び出しエラー:", data.message);
            // トークン期限切れなどのエラー処理
            document.getElementById('status-message').textContent = `エラー: ${data.message}`;
        }
    } catch (error) {
        console.error("ネットワークエラー:", error);
        document.getElementById('status-message').textContent = `ネットワークエラーが発生しました。`;
    }
}

/**
 * 3. 画面に情報を表示する (DOM操作)
 */
function displayChannelInfo(info) {
    const title = info.snippet.title;
    const subscribers = info.statistics.subscriberCount;
    const views = info.statistics.viewCount;

    const outputDiv = document.getElementById('channel-info-output');
    outputDiv.innerHTML = `
        <h2>✅ ログイン成功！</h2>
        <p>ようこそ、<strong>${title}</strong> さん！</p>
        <ul>
            <li>チャンネル登録者数: ${subscribers} 人</li>
            <li>総再生回数: ${views} 回</li>
            <li>チャンネルURL: <a href="https://youtube.com/channel/${info.id}" target="_blank">${info.customUrl || info.id}</a></li>
        </ul>
    `;
    // リフレッシュトークンは重要なので、localStorageなどに保存することを検討
    // console.log("リフレッシュトークンは後で使います:", localStorage.getItem('refresh_token')); 
}

/**
 * メインの実行ロジック
 */
document.addEventListener('DOMContentLoaded', () => {
    const { status, accessToken, refreshToken } = getUrlParams();
    
    if (status === 'success' && accessToken) {
        // トークンを保存（ここではlocalStorageに保存）
        localStorage.setItem('access_token', accessToken);
        // リフレッシュトークンは永続的に保存
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
            document.getElementById('status-message').textContent = 'ログインに成功し、トークンを保存しました！';
        }

        // YouTubeデータの取得を開始
        fetchYouTubeData(accessToken);
        
    } else if (localStorage.getItem('access_token')) {
        // トークンがlocalStorageに存在する場合、それを使ってデータを取得 (ページ再読み込み時など)
        const storedToken = localStorage.getItem('access_token');
        document.getElementById('status-message').textContent = '保存されたトークンでデータ取得を試みます...';
        fetchYouTubeData(storedToken);
    } else {
        // ログインしていない場合
        document.getElementById('status-message').textContent = 'Googleでログインしてください。';
    }
});
