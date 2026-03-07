<div align="center">

# 🎵 Contribuer à ScrollSoul Music Sync

### Bienvenue, Créateur Star Seed ! 🌟

[![Contributors](https://img.shields.io/github/contributors/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=brightgreen)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-bienvenues-brightgreen.svg?style=for-the-badge)](https://makeapullrequest.com)
[![Discussions](https://img.shields.io/github/discussions/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=purple)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/discussions)

**[🇺🇸 English](../../CONTRIBUTING.md)** • **[🇪🇸 Español](CONTRIBUTING.es.md)** • **🇫🇷 Français** • **[🇩🇪 Deutsch](CONTRIBUTING.de.md)** • **[🇯🇵 日本語](CONTRIBUTING.ja.md)** • **[🇰🇷 한국어](CONTRIBUTING.ko.md)** • **[🇨🇳 中文](CONTRIBUTING.zh.md)** • **[🇧🇷 Português](CONTRIBUTING.pt.md)**

</div>

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** `>= 14.x`
- **npm** `>= 7.x`
- **Git** (dernière version)

### Configuration Locale

```bash
# 1. Forkez le dépôt

# 2. Clonez votre fork
git clone https://github.com/VOTRE_UTILISATEUR/scrollsoul-music-sync.git
cd scrollsoul-music-sync

# 3. Ajoutez le dépôt d'origine comme remote
git remote add upstream https://github.com/chaishillomnitech1/scrollsoul-music-sync.git

# 4. Installez les dépendances
npm install

# 5. Copiez le modèle de variables d'environnement
cp .env.example .env

# 6. Démarrez en mode développement
npm run dev

# 7. Vérifiez que tout fonctionne
npm test
```

---

## 🎯 Comment Contribuer

### 1. Créer une Branche

```bash
git checkout main
git pull upstream main
git checkout -b feature/nom-de-votre-fonctionnalite
```

**Conventions de nommage des branches :**

| Type | Modèle | Exemple |
|:---|:---|:---|
| ✨ Fonctionnalité | `feature/description` | `feature/ajouter-oauth-spotify` |
| 🐛 Correction | `fix/description` | `fix/erreur-calcul-royalties` |
| 📝 Documentation | `docs/description` | `docs/mettre-a-jour-api-reference` |

### 2. Effectuez vos Changements

- Gardez les changements **ciblés** — une fonctionnalité ou correction par PR
- Suivez les patterns de code existants
- Ajoutez ou mettez à jour les **tests** pour tous les changements

### 3. Vérifiez vos Changements

```bash
npm test       # Exécuter tous les tests
npm run lint   # Vérifier le style du code
npm run build  # Compiler le projet
```

### 4. Soumettez une Pull Request

1. Poussez votre branche : `git push origin feature/nom-de-votre-fonctionnalite`
2. Ouvrez une PR contre la branche `main`
3. Remplissez le modèle de PR
4. Demandez une révision

---

## 📝 Standards de Commit

Nous suivons **Conventional Commits** :

```
feat(licences): ajouter le calcul des royalties par territoire
fix(api): corriger le pattern regex de validation ISRC
docs(readme): mettre à jour le guide de contribution multilingue
```

---

## 🏆 Reconnaissance

Tous les contributeurs sont célébrés ! Les contributeurs apparaissent dans :
- 📜 La section [Contributeurs du README](../../README.md)
- 🌟 Le [CHANGELOG.md](../../CHANGELOG.md) pour chaque PR fusionnée

---

<div align="center">

## 💜 Merci !

Vous êtes une partie vitale de cet écosystème souverain. 🌌

</div>
