<div align="center">

# 🎵 为 ScrollSoul Music Sync 做贡献

### 欢迎，Star Seed 创造者！ 🌟

[![Contributors](https://img.shields.io/github/contributors/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=brightgreen)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-欢迎-brightgreen.svg?style=for-the-badge)](https://makeapullrequest.com)
[![Discussions](https://img.shields.io/github/discussions/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=purple)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/discussions)

**[🇺🇸 English](../../CONTRIBUTING.md)** • **[🇪🇸 Español](CONTRIBUTING.es.md)** • **[🇫🇷 Français](CONTRIBUTING.fr.md)** • **[🇩🇪 Deutsch](CONTRIBUTING.de.md)** • **[🇯🇵 日本語](CONTRIBUTING.ja.md)** • **[🇰🇷 한국어](CONTRIBUTING.ko.md)** • **🇨🇳 中文** • **[🇧🇷 Português](CONTRIBUTING.pt.md)**

</div>

---

## 🚀 快速开始

### 先决条件

- **Node.js** `>= 14.x`
- **npm** `>= 7.x`
- **Git** (最新版本)

### 本地设置

```bash
# 1. Fork 仓库

# 2. 克隆您的 Fork
git clone https://github.com/您的用户名/scrollsoul-music-sync.git
cd scrollsoul-music-sync

# 3. 添加上游远程
git remote add upstream https://github.com/chaishillomnitech1/scrollsoul-music-sync.git

# 4. 安装依赖
npm install

# 5. 复制环境模板
cp .env.example .env

# 6. 以开发模式启动
npm run dev

# 7. 验证一切正常
npm test
```

---

## 🎯 如何贡献

### 1. 创建分支

```bash
git checkout main
git pull upstream main
git checkout -b feature/您的功能名称
```

### 2. 进行更改

- 保持更改**集中** — 每个 PR 一个功能或修复
- 遵循现有的代码模式
- 为所有更改添加或更新**测试**

### 3. 验证您的更改

```bash
npm test       # 运行所有测试
npm run lint   # 检查代码风格
npm run build  # 构建项目
```

### 4. 提交 Pull Request

1. 推送分支: `git push origin feature/您的功能名称`
2. 针对 `main` 分支开启 PR
3. 完整填写 PR 模板
4. 请求代码审查

---

## 📝 提交消息规范

我们遵循 **Conventional Commits**:

```
feat(许可): 添加基于地区的版税计算
fix(api): 修正 ISRC 验证正则表达式模式
docs(readme): 更新多语言贡献指南
```

---

<div align="center">

## 💜 感谢！

您是这个主权生态系统的重要组成部分。 🌌

</div>
