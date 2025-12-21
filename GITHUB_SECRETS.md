# GitHub Secrets Configuration Guide

このドキュメントでは、GitHub Actions で使用する Secrets の設定方法を説明します。

## 設定手順

1. GitHub リポジトリにアクセス
2. **Settings** > **Secrets and variables** > **Actions** をクリック
3. **New repository secret** をクリック
4. 以下のシークレットを追加します

## 必須シークレット

### Firebase 関連
- **NEXT_PUBLIC_FIREBASE_API_KEY**: Firebase API キー
- **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**: Firebase 認証ドメイン
- **NEXT_PUBLIC_FIREBASE_PROJECT_ID**: Firebase プロジェクト ID
- **NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**: Firebase Storage バケット
- **NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**: Firebase メッセージング送信者 ID
- **NEXT_PUBLIC_FIREBASE_APP_ID**: Firebase アプリケーション ID

### AWS 関連
- **AWS_ACCESS_KEY_ID**: AWS アクセスキー ID
- **AWS_SECRET_ACCESS_KEY**: AWS シークレットアクセスキー
- **AWS_EC2_INSTANCE_ID**: EC2 インスタンス ID
- **AWS_EC2_INSTANCE_IP**: EC2 インスタンス IP アドレス
- **AWS_EC2_PRIVATE_KEY**: EC2 接続用の秘密鍵 (PEM 形式)

### Vercel 関連
- **VERCEL_TOKEN**: Vercel アクセストークン
- **VERCEL_ORG_ID**: Vercel 組織 ID
- **VERCEL_PROJECT_ID**: Vercel プロジェクト ID

## Firebase の設定方法

1. [Firebase Console](https://console.firebase.google.com) にアクセス
2. プロジェクトを選択
3. **プロジェクト設定** > **サービスアカウント** > **新しい秘密鍵を生成**
4. JSON ファイルをダウンロード
5. 必要な情報を GitHub Secrets に登録

## AWS の設定方法

1. [AWS Management Console](https://console.aws.amazon.com) にアクセス
2. **IAM** > **ユーザー** > **ユーザーを作成**
3. プログラムアクセスを有効化
4. 必要な権限をアタッチ (EC2、S3 など)
5. アクセスキーをダウンロード
6. GitHub Secrets に登録

## Vercel の設定方法

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. **Settings** > **Tokens**
3. **Create Token** をクリック
4. 生成されたトークンを GitHub Secrets に登録

## セキュリティガイドライン

- **秘密鍵は絶対に公開しないこと**
- リポジトリにシークレットをコミットしない
- 定期的に秘密鍵をローテーション
- 不要になった秘密鍵は削除
- アクセス権限は最小限に設定
