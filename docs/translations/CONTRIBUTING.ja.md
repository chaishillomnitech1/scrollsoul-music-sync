<div align="center">

# 🎵 ScrollSoul Music Syncへのコントリビューション

### ようこそ、Star Seedクリエイター！ 🌟

[![Contributors](https://img.shields.io/github/contributors/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=brightgreen)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-歓迎-brightgreen.svg?style=for-the-badge)](https://makeapullrequest.com)
[![Discussions](https://img.shields.io/github/discussions/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=purple)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/discussions)

**[🇺🇸 English](../../CONTRIBUTING.md)** • **[🇪🇸 Español](CONTRIBUTING.es.md)** • **[🇫🇷 Français](CONTRIBUTING.fr.md)** • **[🇩🇪 Deutsch](CONTRIBUTING.de.md)** • **🇯🇵 日本語** • **[🇰🇷 한국어](CONTRIBUTING.ko.md)** • **[🇨🇳 中文](CONTRIBUTING.zh.md)** • **[🇧🇷 Português](CONTRIBUTING.pt.md)**

</div>

---

## 🚀 クイックスタート

### 必要条件

- **Node.js** `>= 14.x`
- **npm** `>= 7.x`
- **Git** (最新版)

### ローカル環境のセットアップ

```bash
# 1. リポジトリをフォーク

# 2. フォークをクローン
git clone https://github.com/あなたのユーザー名/scrollsoul-music-sync.git
cd scrollsoul-music-sync

# 3. アップストリームリモートを追加
git remote add upstream https://github.com/chaishillomnitech1/scrollsoul-music-sync.git

# 4. 依存関係をインストール
npm install

# 5. 環境テンプレートをコピー
cp .env.example .env

# 6. 開発モードで起動
npm run dev

# 7. すべてが動作することを確認
npm test
```

---

## 🎯 コントリビューション方法

### 1. ブランチを作成

```bash
git checkout main
git pull upstream main
git checkout -b feature/機能名
```

### 2. 変更を加える

- 変更は**焦点を絞って** — PRごとに一つの機能または修正
- 既存のコードパターンに従う
- すべての変更に**テスト**を追加または更新

### 3. 変更を確認

```bash
npm test       # すべてのテストを実行
npm run lint   # コードスタイルを確認
npm run build  # プロジェクトをビルド
```

### 4. プルリクエストを送信

1. ブランチをプッシュ: `git push origin feature/機能名`
2. `main`ブランチに対してPRを開く
3. PRテンプレートを完全に記入
4. レビューをリクエスト

---

## 📝 コミットメッセージの規則

**Conventional Commits**に従います:

```
feat(ライセンス): 地域別ロイヤルティ計算を追加
fix(api): ISRC検証の正規表現パターンを修正
docs(readme): 多言語コントリビューションガイドを更新
```

---

<div align="center">

## 💜 ありがとうございます！

あなたはこのソブリンエコシステムの重要な一部です。 🌌

</div>
