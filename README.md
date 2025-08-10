# Vue3 + Swagger 検証用リポジトリ

このプロジェクトは、Viteで構築したVue3開発環境にSwagger API定義書を統合し、openapi-typescriptライブラリを用いた型安全なAPI呼び出しができる最小限のシンプルな検証用リポジトリです。

## 📋 概要

- **フロントエンド**: Vue3 + TypeScript + Vite
- **バックエンド**: TypeScript + Node.js HTTP Server
- **API定義**: OpenAPI/Swagger 3.0
- **型生成**: openapi-typescript
- **HTTPクライアント**: axios
- **開発ツール**: vue-tsc

## 🎯 機能

- ✅ ボタンクリックでAPI呼び出し
- ✅ 型安全なレスポンス処理
- ✅ レスポンス履歴の表示
- ✅ 現在時刻を含む挨拶メッセージの生成（yyyymmdd-hhmmss形式）

## 🛠️ セットアップ

### 前提条件

- Node.js 18.3以上
- npm, yarn, pnpm, または bun

### インストール

```bash
# プロジェクトのクローン/ダウンロード後
cd vue3-swagger-verification

# 依存関係のインストール
npm install
# または
yarn install
# または
pnpm install
# または
bun install
```

### 型定義の生成

```bash
# API定義から型定義ファイルを生成
npm run generate-types
```

### 開発サーバーの起動

#### 1. APIサーバーの起動

```bash
# APIサーバーを開発モードで起動（ポート3001）
npm run server:dev
```

#### 2. フロントエンド開発サーバーの起動

別のターミナルで：

```bash
# フロントエンド開発サーバー起動（ポート5173）
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

## 📁 プロジェクト構造

```
vue3-swagger-verification/
├── docs/
│   └── api.yaml              # Swagger API定義書
├── server/                   # APIサーバー
│   ├── src/
│   │   └── index.ts          # APIサーバーのメインファイル
│   ├── package.json          # サーバー用の依存関係
│   └── tsconfig.json         # サーバー用TypeScript設定
├── src/                      # フロントエンド
│   ├── types/
│   │   └── api.d.ts          # 生成された型定義ファイル
│   ├── App.vue               # メインコンポーネント
│   └── main.ts               # エントリーポイント
├── package.json
├── tsconfig.json             # TypeScript設定
├── vite.config.js            # Vite設定
└── README.md
```

## 🔧 利用可能なスクリプト

### フロントエンド
- `npm run dev` - フロントエンド開発サーバー起動
- `npm run build` - 本番用ビルド
- `npm run preview` - ビルド後のプレビュー
- `npm run type-check` - TypeScript型チェック
- `npm run generate-types` - API定義から型定義を生成

### バックエンド（APIサーバー）
- `npm run server:dev` - APIサーバー開発モード（ホットリロード）
- `npm run server:build` - APIサーバーのビルド
- `npm run server:start` - ビルド済みAPIサーバーの起動

## 📖 API定義書

API定義書は `docs/api.yaml` に配置されています。

### エンドポイント

- **GET /test** - テスト用エンドポイント
  - レスポンス: `{"message": "hello world yyyymmdd-hhmmss"}`
  - 例: `{"message": "hello world 20231226-143022"}`

## 🎨 機能説明

### 型安全なAPI呼び出し

```typescript
// 生成された型定義を使用
type TestResponse = operations['getTestMessage']['responses'][200]['content']['application/json']

// 型安全なレスポンス処理
const mockResponse: TestResponse = {
  message: `hello world ${timestamp}`
}
```

### レスポンス履歴管理

- 新しいレスポンスは配列の先頭に追加
- タイムスタンプ付きで表示
- 型安全な状態管理

## 🧪 動作確認方法

1. APIサーバーを起動: `npm run server:dev`
2. 別ターミナルでフロントエンドを起動: `npm run dev`
3. ブラウザで `http://localhost:5173` にアクセス
4. 「/test API を呼び出す」ボタンをクリック
5. レスポンス履歴セクションに実際のAPIレスポンスが表示されることを確認
6. 複数回クリックして履歴が蓄積されることを確認

## 📝 技術的な特徴

### 型生成の仕組み

1. `docs/api.yaml` にOpenAPI 3.0仕様でAPI定義を記述
2. `openapi-typescript` コマンドで型定義ファイルを生成
3. Vue3コンポーネントで生成された型を活用

### 型安全性の確保

- すべてのAPIレスポンスが型付けされている
- コンパイル時に型エラーを検出
- IDEでの自動補完とインテリセンス

## 🔄 型定義の更新

API定義を変更した後は、以下のコマンドで型定義を再生成してください：

```bash
npm run generate-types
```

## 🚀 本番ビルド

```bash
# 型チェック付きビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## 📄 ライセンス

このプロジェクトは検証用途のため、特定のライセンスは設定していません。

---

**Note**: このプロジェクトには、api.yamlに基づいた実際のAPIサーバー実装が含まれています。フロントエンドとバックエンドの両方を起動することで、完全なフルスタック開発環境を体験できます。