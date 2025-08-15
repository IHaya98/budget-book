# 家計簿アプリ - Budget Book

シンプルで使いやすい家計簿管理Webアプリケーションです。モバイル対応のレスポンシブデザインで、いつでもどこでも家計を管理できます。

## 機能

- **カテゴリ管理**: 収入・支出の分類をカスタマイズ
- **収支管理**: 日々の収入・支出を記録・管理
- **予算設定**: 月間の予算を設定し、進捗を可視化
- **データ可視化**: グラフで家計状況を把握
- **モバイル対応**: スマートフォンやタブレットでも使いやすいレスポンシブデザイン

## 技術スタック

- **フロントエンド**: Next.js 15, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: PostgreSQL (Neon)
- **ORM**: Prisma
- **パッケージマネージャー**: pnpm
- **ビルドツール**: Vite (Next.js Turbopack)

## セットアップ

### 前提条件

- Node.js 18以上
- pnpm
- PostgreSQLデータベース（Neon推奨）

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd budget-book
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# データベース接続
DATABASE_URL="postgresql://username:password@localhost:5432/budget_book"

# Next.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

**Neonデータベースを使用する場合：**
1. [Neon](https://neon.tech)でアカウントを作成
2. 新しいプロジェクトを作成
3. 接続文字列をコピーして`DATABASE_URL`に設定

### 4. データベースのセットアップ

```bash
# Prismaクライアントの生成
npx prisma generate

# データベースのマイグレーション
npx prisma db push

# データベースの確認（オプション）
npx prisma studio
```

### 5. 開発サーバーの起動

```bash
pnpm dev
```

アプリケーションが http://localhost:3000 で起動します。

## 使用方法

### 1. カテゴリの設定

まず、収入・支出のカテゴリを設定します：
- 「カテゴリ」ページに移動
- 「カテゴリを追加」ボタンをクリック
- カテゴリ名、タイプ（収入/支出）、色を設定

### 2. 予算の設定

月間の予算を設定します：
- 「予算設定」ページに移動
- 「予算を設定」ボタンをクリック
- カテゴリ、金額、対象月を設定

### 3. 収支の記録

日々の収入・支出を記録します：
- 「収支管理」ページに移動
- 「取引を追加」ボタンをクリック
- 金額、カテゴリ、説明、日付を入力

### 4. 家計状況の確認

ダッシュボードで家計状況を確認：
- 今月の収入・支出・残高
- 予算達成率
- 最近の取引履歴

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── categories/    # カテゴリAPI
│   │   ├── transactions/  # 取引API
│   │   └── budgets/       # 予算API
│   ├── categories/        # カテゴリ管理ページ
│   ├── transactions/      # 収支管理ページ
│   ├── budgets/           # 予算設定ページ
│   └── page.tsx           # ホームページ
├── components/             # Reactコンポーネント
│   ├── Navigation.tsx     # ナビゲーション
│   ├── CategoryList.tsx   # カテゴリ一覧
│   ├── TransactionList.tsx # 取引一覧
│   └── BudgetList.tsx     # 予算一覧
└── lib/                    # ユーティリティ
    └── prisma.ts          # Prismaクライアント
```

## 開発

### コードの品質管理

```bash
# リンターの実行
pnpm lint

# 型チェック
pnpm type-check
```

### データベースの管理

```bash
# Prisma Studioの起動
npx prisma studio

# マイグレーションの作成
npx prisma migrate dev

# データベースのリセット
npx prisma migrate reset
```

## デプロイ

### Vercelへのデプロイ

1. Vercelでプロジェクトを作成
2. GitHubリポジトリと連携
3. 環境変数を設定
4. デプロイ

### その他のプラットフォーム

- Netlify
- Railway
- Render
- その他のVPS

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

## サポート

問題が発生した場合は、GitHubのイシューを作成してください。
