# Papers


# サービス概要
主に学生に向けたもので、作成したレポートや論文を気軽に共有できることを目指したアプリとなっています。

詳細: https://qiita.com/dmyoa/private/bb5b6cad30ed517ec43e 

# 使用技術
### Back End
- ``Ruby on Rails``

### 主要gem
- ``devise / devise_token_auth`` : トークン認証
- ``carrierwave / aws-fog`` : AWSへのファイルアップロード

### Front End
- ``React``
- ``TypeScript``

### UIライブラリ
- ``Material UI``

### インフラ
- ``Docker / Docker Compose`` : 開発環境をコンテナ化（Rails,MySQL,React）
- ``AWS`` : Fargateへのデプロイ

# 機能一覧
- アカウント作成、ログイン、ログアウト機能
- アカウント編集機能
  - プロフィール文等の基本情報の変更
  - メールアドレスの変更
  - パスワードの変更
- アカウントの削除機能
- 投稿作成・編集・削除機能
- 投稿検索機能
- レビュー・リプライ機能
  - メッセージの作成・編集削除
- いいね機能
  - 投稿・レビュー・リプライへのいいね 
- 投稿への評価機能(5つ星)
- フォロー機能
- 通知機能
  - フォロー通知
  - いいね通知
  - レビュー・リプライ通知
- レスポンシブ対応
