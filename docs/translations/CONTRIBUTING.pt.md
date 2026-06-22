<div align="center">

# 🎵 Contribuindo para ScrollSoul Music Sync

### Bem-vindo, Criador Star Seed! 🌟

[![Contributors](https://img.shields.io/github/contributors/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=brightgreen)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-bem--vindos-brightgreen.svg?style=for-the-badge)](https://makeapullrequest.com)
[![Discussions](https://img.shields.io/github/discussions/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=purple)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/discussions)

**[🇺🇸 English](../../CONTRIBUTING.md)** • **[🇪🇸 Español](CONTRIBUTING.es.md)** • **[🇫🇷 Français](CONTRIBUTING.fr.md)** • **[🇩🇪 Deutsch](CONTRIBUTING.de.md)** • **[🇯🇵 日本語](CONTRIBUTING.ja.md)** • **[🇰🇷 한국어](CONTRIBUTING.ko.md)** • **[🇨🇳 中文](CONTRIBUTING.zh.md)** • **🇧🇷 Português**

</div>

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** `>= 14.x`
- **npm** `>= 7.x`
- **Git** (versão mais recente)

### Configuração Local

```bash
# 1. Faça um fork do repositório

# 2. Clone seu fork
git clone https://github.com/SEU_USUARIO/scrollsoul-music-sync.git
cd scrollsoul-music-sync

# 3. Adicione o remote upstream
git remote add upstream https://github.com/chaishillomnitech1/scrollsoul-music-sync.git

# 4. Instale as dependências
npm install

# 5. Copie o template de variáveis de ambiente
cp .env.example .env

# 6. Inicie em modo de desenvolvimento
npm run dev

# 7. Verifique que tudo funciona
npm test
```

---

## 🎯 Como Contribuir

### 1. Crie uma Branch

```bash
git checkout main
git pull upstream main
git checkout -b feature/nome-da-sua-funcionalidade
```

**Convenções de nomes para branches:**

| Tipo | Padrão | Exemplo |
|:---|:---|:---|
| ✨ Funcionalidade | `feature/descricao` | `feature/adicionar-oauth-spotify` |
| 🐛 Correção | `fix/descricao` | `fix/erro-calculo-royalties` |
| 📝 Documentação | `docs/descricao` | `docs/atualizar-referencia-api` |

### 2. Faça suas Alterações

- Mantenha as alterações **focadas** — uma funcionalidade ou correção por PR
- Siga os padrões de código existentes
- Adicione ou atualize **testes** para todas as alterações

### 3. Verifique suas Alterações

```bash
npm test       # Executar todos os testes
npm run lint   # Verificar estilo de código
npm run build  # Compilar o projeto
```

### 4. Envie um Pull Request

1. Envie sua branch: `git push origin feature/nome-da-sua-funcionalidade`
2. Abra um PR contra a branch `main`
3. Preencha o template de PR completamente
4. Solicite uma revisão

---

## 📝 Padrões de Mensagem de Commit

Seguimos **Conventional Commits**:

```
feat(licencas): adicionar calculo de royalties por territorio
fix(api): corrigir padrao regex de validacao ISRC
docs(readme): atualizar guia de contribuicao multilinguagem
```

---

<div align="center">

## 💜 Obrigado!

Você é uma parte vital deste ecossistema soberano. 🌌

</div>
