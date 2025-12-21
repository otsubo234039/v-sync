# AWS EC2 セットアップガイド

このガイドは、AWS EC2 インスタンスに V-Sync バッチサービスをセットアップする手順を説明します。

## 前提条件

- AWS アカウント
- EC2 インスタンス (Amazon Linux 2 または Ubuntu 推奨)
- SSH アクセス権限
- AWS IAM 認証情報

## セットアップステップ

### 1. EC2 インスタンスの起動

```bash
# AWS Management Console から EC2 インスタンスを起動
# インスタンスタイプ: t3.micro (無料枠対象)
# OS: Amazon Linux 2 または Ubuntu
# セキュリティグループで以下を許可:
#   - SSH (ポート 22)
#   - HTTP (ポート 80)
#   - HTTPS (ポート 443)
```

### 2. インスタンスに接続

```bash
# SSH キーペアを取得
# SSH 接続
ssh -i your-key.pem ec2-user@your-instance-ip

# または Ubuntu の場合
ssh -i your-key.pem ubuntu@your-instance-ip
```

### 3. システムを更新

```bash
# Amazon Linux 2
sudo yum update -y
sudo yum install -y git docker

# Ubuntu
sudo apt-get update
sudo apt-get install -y git docker.io
```

### 4. Docker と Docker Compose をインストール

```bash
# Docker サービスを有効化・起動
sudo systemctl enable docker
sudo systemctl start docker

# 現在のユーザーを docker グループに追加
sudo usermod -aG docker ec2-user
# (ログアウトして再度ログイン)

# Docker Compose をインストール
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 5. Ruby をインストール

```bash
# rbenv を使用して Ruby をインストール
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
cd ~/.rbenv && src/configure && make -C src
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
source ~/.bashrc

# Ruby のビルド依存パッケージをインストール
sudo yum install -y ruby-devel gcc g++ make

# Ruby 3.2.0 をインストール
rbenv install 3.2.0
rbenv global 3.2.0

# Bundler をインストール
gem install bundler
```

### 6. プロジェクトをクローン

```bash
cd /home/ec2-user
git clone https://github.com/yourusername/v-sync.git
cd v-sync/apps/batch
```

### 7. 環境変数を設定

```bash
# .env ファイルを作成
vi .env

# 以下の環境変数を設定:
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
LOG_LEVEL=INFO
```

### 8. 依存パッケージをインストール

```bash
cd /home/ec2-user/v-sync/apps/batch
bundle install
```

### 9. バッチサービスを起動

```bash
# 手動で起動テスト
./batch_runner.sh start

# ステータスを確認
./batch_runner.sh status

# ログを確認
./batch_runner.sh logs
```

### 10. systemd サービスを作成 (自動起動設定)

```bash
# サービスファイルを作成
sudo vi /etc/systemd/system/v-sync-batch.service
```

以下の内容を追加:

```ini
[Unit]
Description=V-Sync Batch Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/v-sync/apps/batch
ExecStart=/home/ec2-user/v-sync/apps/batch/batch_runner.sh start
ExecStop=/home/ec2-user/v-sync/apps/batch/batch_runner.sh stop
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# サービスを有効化・起動
sudo systemctl daemon-reload
sudo systemctl enable v-sync-batch
sudo systemctl start v-sync-batch

# ステータスを確認
sudo systemctl status v-sync-batch
```

### 11. Docker Compose で起動

```bash
cd /home/ec2-user/v-sync

# コンテナをビルド・起動
docker-compose up -d

# ログを確認
docker-compose logs -f

# コンテナを停止
docker-compose down
```

## AWS IAM 権限設定

バッチプロセッサーに必要な AWS IAM 権限:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:StartInstances",
        "ec2:StopInstances"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::v-sync-bucket/*",
        "arn:aws:s3:::v-sync-bucket"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData"
      ],
      "Resource": "*"
    }
  ]
}
```

## モニタリング

### ログの確認

```bash
# リアルタイムログ
tail -f /home/ec2-user/v-sync/apps/batch/logs/batch_*.log

# または systemd ログ
sudo journalctl -u v-sync-batch -f

# または Docker ログ
docker logs -f v-sync-batch
```

### ヘルスチェック

```bash
# プロセスが動作しているか確認
./batch_runner.sh status

# または
sudo systemctl status v-sync-batch

# または
docker ps | grep v-sync-batch
```

### CloudWatch メトリクス設定

CloudWatch ダッシュボードで以下を監視:
- CPU 使用率
- メモリ使用量
- ディスク空き容量
- ネットワークトラフィック

## トラブルシューティング

### バッチサービスが起動しない

```bash
# ログを確認
tail -100 /home/ec2-user/v-sync/apps/batch/logs/batch_*.log

# プロセスが存在するか確認
ps aux | grep batch_processor

# 手動で実行して エラーを確認
cd /home/ec2-user/v-sync/apps/batch
bundle exec ruby batch_processor.rb
```

### メモリ不足エラー

```bash
# メモリ使用量を確認
free -h

# スワップ領域を追加
sudo dd if=/dev/zero of=/swapfile bs=1G count=2
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Docker エラー

```bash
# Docker ステータスを確認
sudo systemctl status docker

# Docker を再起動
sudo systemctl restart docker

# コンテナログを確認
docker logs v-sync-batch
```

## セキュリティベストプラクティス

1. **セキュリティグループの制限**
   - SSH アクセスを特定の IP に制限
   - 必要なポートのみ開放

2. **IAM ロール**
   - EC2 インスタンスに IAM ロールをアタッチ
   - 認証情報をハードコードしない

3. **ファイアウォール設定**
   ```bash
   sudo firewall-cmd --add-port=3001/tcp --permanent
   sudo firewall-cmd --reload
   ```

4. **定期的なバックアップ**
   - EBS スナップショットを定期的に取得
   - ログを S3 にアーカイブ

5. **ログ監視**
   - CloudWatch Logs へのアップロード設定
   - アラーム設定

## コスト最適化

- **インスタンスタイプ**: t3.micro (無料枠対象)
- **ストレージ**: 最小限の EBS ボリューム
- **トラフィック**: プライベートサブネットを使用
- **バックアップ**: 定期的に不要なスナップショットを削除

## デプロイ後の確認

```bash
# EC2 インスタンス ID を GitHub Secrets に登録
AWS_EC2_INSTANCE_ID=i-xxxxxxxxx

# EC2 インスタンス IP を GitHub Secrets に登録
AWS_EC2_INSTANCE_IP=xxx.xxx.xxx.xxx

# SSH 秘密鍵を GitHub Secrets に登録 (PEM 形式)
AWS_EC2_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

---

セットアップ完了後、GitHub Actions が自動的に AWS EC2 にデプロイします。
