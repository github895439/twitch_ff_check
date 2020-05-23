本内容を利用した場合の一切の責任を私は負いません。

# 環境
- OS  
OS 名:                  Microsoft Windows 10 Home  
OS バージョン:          10.0.18362 N/A ビルド 18362  
システムの種類:         x64-based PC

- node.js  
node-v10.16.0-win-x64  
request@2.88.0

# 手順
1. twitchにアプリ登録  
APIを使用するアプリ(≠拡張機能)を登録する。  
(要2段階認証。  
登録後、再度登録したアプリを「管理」で開き、クライアントIDが表示されていないなら「新しい秘密」で発行する。)  
https://dev.twitch.tv/console/apps

1. 自分のID確認  
下記のコマンドを実行して自分のID(≠ログインID)を確認する。  
コマンド出力のid属性の値が自分のIDである。  
`curl -H "Client-ID: <クライアントID>" -X GET "https://api.twitch.tv/helix/users?login=<ログインID>"`

1. node.jsにrequestモジュールをインストール  
`npm install request`

1. 本ツールをダウンロード  
https://github.com/github895439/twitch_ff_check

1. ダウンロードしたものを展開

1. ツールの設定  
ff_check.js内の下記を設定する。

```javascript:ff_check.js
const CLIENT_ID = "<クライアントID>";
const SELF_ID = "<自分のID>";
```

1. ツールを実行(※markdownがおかしく本来は手順7)

```plaintext:標準出力
>node ff_check.js
https://api.twitch.tv/helix/users/follows?from_id=略&first=100
https://api.twitch.tv/helix/users/follows?to_id=略&first=100
following: 略
follower: 略

# both
略

# onlyToSelf
略

# onlyFromSelf
略

>
```

# 備考
大したことではないけど。  
前はフォローもフォロワも誰もが見えてたけど、今はフォローは本人しか見えない。  
けど、APIからだと他人のフォローも見える。  
クリエイターダッシュボードと今までの画面とでUIが統一されてないから過渡だったりするせいかも。  
か、後から修正されたり。  
1アクセスでの最大取得は100で、私は100もいないのでツールは対応していない。  
対応する場合は、レスポンスのpaginationを次のクエリーにafterで指定すればできると思う。

# 参考
- twitch API  
https://dev.twitch.tv/docs/api/reference

- requestモジュール  
https://github.com/request/request

# 履歴
2020/05/23　5月頭のAPI変更に対応    
　requestパッケージがdeprecateになったため、axiosパッケージを使うようにも変更した。    
　このため、axiosパッケージを別途インストールする必要がある。    
　クライアントシークレットも必要になったため、設定を別ファイル(data/setting.json)に分離した。    
2020/05/18　5月頭にAPIの変更があり、それによって認証エラーになるようになったもよう。変更に対応させるつもり。
