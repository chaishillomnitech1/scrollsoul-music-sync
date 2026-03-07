<div align="center">

# 🎵 Zu ScrollSoul Music Sync beitragen

### Willkommen, Star Seed Schöpfer! 🌟

[![Contributors](https://img.shields.io/github/contributors/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=brightgreen)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-willkommen-brightgreen.svg?style=for-the-badge)](https://makeapullrequest.com)
[![Discussions](https://img.shields.io/github/discussions/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=purple)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/discussions)

**[🇺🇸 English](../../CONTRIBUTING.md)** • **[🇪🇸 Español](CONTRIBUTING.es.md)** • **[🇫🇷 Français](CONTRIBUTING.fr.md)** • **🇩🇪 Deutsch** • **[🇯🇵 日本語](CONTRIBUTING.ja.md)** • **[🇰🇷 한국어](CONTRIBUTING.ko.md)** • **[🇨🇳 中文](CONTRIBUTING.zh.md)** • **[🇧🇷 Português](CONTRIBUTING.pt.md)**

</div>

---

## 🚀 Schnellstart

### Voraussetzungen

- **Node.js** `>= 14.x`
- **npm** `>= 7.x`
- **Git** (neueste Version)

### Lokale Einrichtung

```bash
# 1. Repository forken

# 2. Ihren Fork klonen
git clone https://github.com/IHR_BENUTZERNAME/scrollsoul-music-sync.git
cd scrollsoul-music-sync

# 3. Upstream Remote hinzufügen
git remote add upstream https://github.com/chaishillomnitech1/scrollsoul-music-sync.git

# 4. Abhängigkeiten installieren
npm install

# 5. Umgebungsvorlage kopieren
cp .env.example .env

# 6. Entwicklungsserver starten
npm run dev

# 7. Alles testen
npm test
```

---

## 🎯 Wie man beiträgt

### 1. Branch erstellen

```bash
git checkout main
git pull upstream main
git checkout -b feature/ihr-feature-name
```

**Branch-Namenskonventionen:**

| Typ | Muster | Beispiel |
|:---|:---|:---|
| ✨ Feature | `feature/beschreibung` | `feature/spotify-oauth-hinzufuegen` |
| 🐛 Bugfix | `fix/beschreibung` | `fix/royalty-berechnungsfehler` |
| 📝 Dokumentation | `docs/beschreibung` | `docs/api-referenz-aktualisieren` |

### 2. Änderungen vornehmen

- Halten Sie Änderungen **fokussiert** — ein Feature oder Fix pro PR
- Bestehende Code-Muster befolgen
- **Tests** für alle Änderungen hinzufügen oder aktualisieren

### 3. Änderungen prüfen

```bash
npm test       # Alle Tests ausführen
npm run lint   # Code-Stil prüfen
npm run build  # Projekt kompilieren
```

### 4. Pull Request einreichen

1. Branch pushen: `git push origin feature/ihr-feature-name`
2. PR gegen `main` Branch öffnen
3. PR-Template vollständig ausfüllen
4. Review anfordern

---

## 📝 Commit-Nachricht Standards

Wir folgen **Conventional Commits**:

```
feat(lizenzen): territorienbasierte Royalty-Berechnung hinzufügen
fix(api): ISRC-Validierungs-Regex-Muster korrigieren
docs(readme): mehrsprachigen Beitragsleitfaden aktualisieren
```

---

<div align="center">

## 💜 Danke!

Sie sind ein wesentlicher Teil dieses souveränen Ökosystems. 🌌

</div>
