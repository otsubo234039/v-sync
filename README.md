# V-Sync - Video Synchronization Platform

V-Sync は、動画を同期するための完全なプラットフォームです。Next.js フロントエンド、Firebase BaaS、AWS EC2 バッチ処理をシームレスに統合しています。

## 🏗️ プロジェクト構成

```
V-Sync/
├── apps/
│   ├── web/               # フロント: Next.js + TypeScript + TailwindCSS
│   └── batch/             # バッチ: Ruby + ShellScript
├── .github/
│   └── workflows/         # CI/CDパイプライン (GitHub Actions)
├── docker-compose.yml     # Docker Compose 設定
└── README.md             # このファイル
```

## 🛠️ 使用技術

### フロントエンド (Web)
- **フレームワーク**: Next.js 14
- **言語**: TypeScript
- **スタイリング**: TailwindCSS
- **BaaS**: Firebase (Authentication, Firestore, Storage)
- **デプロイ先**: Vercel

### バックエンド (Batch)
- **言語**: Ruby 3.2
- **スクリプティング**: ShellScript
- **コンテナ**: Docker
- **ホスティング**: AWS EC2
- **AWS SDK**: EC2, S3, CloudWatch

### CI/CD
- **プラットフォーム**: GitHub Actions
- **テスト**: ESLint, TypeScript Type Check
- **ビルド**: Next.js Build
- **デプロイ**: Vercel, AWS EC2

## 📦 セットアップ

### 前提条件
- Node.js 18+
- Ruby 3.2+
- Docker & Docker Compose
- AWS アカウント
- Firebase プロジェクト
- Vercel アカウント
- GitHub リポジトリ

### インストール手順

1. **リポジトリをクローン**
```bash
git clone https://github.com/yourusername/v-sync.git
cd v-sync
```

2. **フロントエンド環境を設定**
```bash
cd apps/web
cp .env.example .env.local
npm install
```

3. **環境変数を設定**
```bash
# Firebase 認証情報を .env.local に入力
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
# 他の環境変数も設定
```

4. **バッチ環境を設定**
```bash
cd ../batch
cp .env.example .env
bundle install
```

5. **ローカル開発サーバーを起動**
```bash
# フロントエンド
cd apps/web
npm run dev

# バッチサービス (別のターミナル)
cd apps/batch
./batch_runner.sh start
```

## 🚀 デプロイメント

### Vercel へのデプロイ

GitHub Actions が main ブランチへのプッシュを検出すると、自動的に Vercel へデプロイされます。

手動デプロイ:
```bash
cd apps/web
npm install -g vercel
vercel --prod
```

### AWS EC2 へのデプロイ

バッチサービスは Docker コンテナとして AWS EC2 上で実行されます。

デプロイ前の準備:
1. AWS EC2 インスタンスを起動
2. Docker と Docker Compose をインストール
3. AWS 認証情報を設定

デプロイ実行:
```bash
docker-compose up -d
```

## 📝 環境変数設定

詳細な環境変数設定については、[GITHUB_SECRETS.md](./GITHUB_SECRETS.md) を参照してください。

### Web アプリケーション (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### バッチサービス (.env)
```env
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

## 🔧 コマンド

### Web アプリケーション

```bash
cd apps/web

# 開発サーバーを起動
npm run dev

# ビルド
npm run build

# 本番サーバーを起動
npm start

# リンターを実行
npm run lint

# 型チェック
npm run type-check

# フォーマット
npm run format
```

### バッチサービス

```bash
cd apps/batch

# バッチプロセッサーを起動
./batch_runner.sh start

# バッチプロセッサーを停止
./batch_runner.sh stop

# ステータスを確認
./batch_runner.sh status

# ログを表示
./batch_runner.sh logs

# Docker コンテナをビルド・起動
docker-compose up -d

# Docker コンテナを停止
docker-compose down
```

## 📚 ドキュメント

- [GitHub Secrets 設定ガイド](./GITHUB_SECRETS.md)
- [Firebase 設定ガイド](./apps/web/README.md)
- [AWS EC2 設定ガイド](./apps/batch/README.md)

## 🔐 セキュリティ

- すべてのシークレットは GitHub Secrets に保存
- 本番環境では環境変数で認証情報を管理
- リポジトリには .env ファイルをコミットしない
- 定期的にアクセスキーをローテーション

## 🐛 トラブルシューティング

### Firebase 接続エラー
- Firebase プロジェクト ID が正しいか確認
- API キーが有効か確認
- Firestore のセキュリティルールを確認

### AWS EC2 デプロイエラー
- EC2 インスタンスが起動しているか確認
- セキュリティグループの設定を確認
- IAM 権限が正しく設定されているか確認

### Vercel デプロイエラー
- VERCEL_TOKEN が有効か確認
- 環境変数が正しく設定されているか確認
- ビルドログを確認

## 📧 サポート

問題が発生した場合は、GitHub Issues で報告してください。

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下にあります。

## 👥 貢献

プルリクエストを歓迎します。大きな変更の場合は、まず Issue を開いて変更内容を議論してください。

---

Made with ❤️ by V-Sync Team
