# V-Sync プロジェクト構成ガイド

## ディレクトリ構造

```
V-Sync/
├── apps/
│   ├── web/                          # フロントエンド (Next.js)
│   │   ├── src/
│   │   │   ├── app/                 # App Router (Next.js)
│   │   │   │   ├── layout.tsx       # ルートレイアウト
│   │   │   │   ├── page.tsx         # トップページ
│   │   │   │   └── globals.css      # グローバルスタイル
│   │   │   ├── components/          # React コンポーネント
│   │   │   ├── lib/                 # ユーティリティライブラリ
│   │   │   │   ├── firebase.ts      # Firebase 初期化
│   │   │   │   ├── auth.ts          # 認証ユーティリティ
│   │   │   │   ├── firestore.ts     # Firestore ユーティリティ
│   │   │   │   └── storage.ts       # Storage ユーティリティ
│   │   │   ├── hooks/               # カスタムフック
│   │   │   ├── types/               # TypeScript 型定義
│   │   │   ├── utils/               # ヘルパー関数
│   │   │   └── styles/              # CSS モジュール
│   │   ├── public/                  # 静的ファイル
│   │   ├── package.json             # 依存パッケージ
│   │   ├── tsconfig.json            # TypeScript 設定
│   │   ├── tailwind.config.js        # TailwindCSS 設定
│   │   ├── postcss.config.js         # PostCSS 設定
│   │   ├── next.config.js            # Next.js 設定
│   │   ├── .eslintrc.json            # ESLint 設定
│   │   ├── .prettierrc.json          # Prettier 設定
│   │   ├── .env.example              # 環境変数テンプレート
│   │   └── .gitignore                # Git 除外ファイル
│   │
│   └── batch/                        # バッチサービス (Ruby)
│       ├── batch_processor.rb        # メインプロセッサー
│       ├── batch_runner.sh           # 実行スクリプト
│       ├── Dockerfile                # Docker イメージ定義
│       ├── Gemfile                   # Ruby 依存パッケージ
│       ├── .env.example              # 環境変数テンプレート
│       ├── logs/                     # ログディレクトリ
│       └── .gitignore                # Git 除外ファイル
│
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions CI/CD パイプライン
│
├── docker-compose.yml                # Docker Compose 設定
├── package.json                      # ルートパッケージ設定
├── .gitignore                        # Git 除外ファイル
├── README.md                         # プロジェクト概要
├── GITHUB_SECRETS.md                 # GitHub Secrets 設定ガイド
└── PROJECT_STRUCTURE.md              # このファイル
```

## 各ディレクトリの説明

### apps/web (フロントエンド)

Next.js + TypeScript + TailwindCSS で構築されたフロントエンドアプリケーション。

**主な責務:**
- ユーザーインターフェース
- Firebase 認証管理
- Firestore データ操作
- Storage からのファイル管理
- Vercel へのデプロイ

**重要なファイル:**
- `src/lib/firebase.ts`: Firebase SDK の初期化
- `src/lib/auth.ts`: 認証関連のユーティリティ
- `src/lib/firestore.ts`: データベース操作
- `src/lib/storage.ts`: ファイルストレージ操作

### apps/batch (バッチサービス)

Ruby/ShellScript + Docker で構築されたバッチ処理サービス。

**主な責務:**
- 定期的なバッチジョブ処理
- 動画同期処理
- データクリーンアップ
- AWS リソース管理

**重要なファイル:**
- `batch_processor.rb`: メインロジック実装
- `batch_runner.sh`: 実行・管理スクリプト
- `Dockerfile`: コンテナイメージ定義

### .github/workflows

GitHub Actions による CI/CD パイプライン定義。

**処理フロー:**
1. **test**: ESLint, TypeScript チェック
2. **build-web**: Next.js ビルド
3. **deploy-vercel**: Vercel へのデプロイ
4. **build-batch**: Docker イメージビルド
5. **deploy-ec2**: AWS EC2 へのデプロイ

## 開発フロー

### ローカル開発

```bash
# フロントエンド
cd apps/web
npm install
npm run dev      # http://localhost:3000

# バッチサービス (別のターミナル)
cd apps/batch
bundle install
./batch_runner.sh start
```

### ビルド & デプロイ

```bash
# ビルド
npm run build

# Docker コンテナの起動
docker-compose up -d

# デプロイ (自動)
git push origin main  # GitHub Actions が自動実行
```

## 設定ファイル一覧

| ファイル | 説明 |
|---------|------|
| `tsconfig.json` | TypeScript コンパイラ設定 |
| `tailwind.config.js` | TailwindCSS カスタマイズ |
| `next.config.js` | Next.js 設定 |
| `.eslintrc.json` | ESLint ルール設定 |
| `.prettierrc.json` | Prettier フォーマット設定 |
| `docker-compose.yml` | マルチコンテナ定義 |
| `Dockerfile` | Docker イメージビルド定義 |
| `Gemfile` | Ruby 依存パッケージ |

## 環境変数

### Web アプリケーション
- Firebase API キー類
- デプロイ先 URL

### バッチサービス
- AWS 認証情報
- ログレベル設定

詳細は [GITHUB_SECRETS.md](./GITHUB_SECRETS.md) を参照。

## デプロイメント先

| 環境 | サービス | 対象 |
|------|---------|------|
| 本番 | Vercel | Web アプリケーション |
| 本番 | AWS EC2 | バッチサービス |
| 開発 | localhost | 両アプリケーション |

## トラブルシューティング

### ポート競合エラー
```bash
# 使用中のプロセスを確認
lsof -i :3000  # Web
lsof -i :3001  # Batch

# プロセスを終了
kill -9 <PID>
```

### Docker エラー
```bash
# コンテナの再構築
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Firebase エラー
- 環境変数の確認
- Firebase Console でプロジェクト設定の確認
- Firestore セキュリティルールの確認

## セキュリティチェックリスト

- [ ] 本番環境の環境変数が正しく設定されている
- [ ] .env ファイルが .gitignore に追加されている
- [ ] GitHub Secrets がすべて設定されている
- [ ] AWS IAM ロールが最小権限原則に従っている
- [ ] Firebase セキュリティルールが制限されている
- [ ] Vercel デプロイトークンが安全に管理されている

---

最終更新: 2025年12月21日
