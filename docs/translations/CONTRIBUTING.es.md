<div align="center">

# 🎵 Contribuir a ScrollSoul Music Sync

### ¡Bienvenido, Creador Star Seed! 🌟

[![Contributors](https://img.shields.io/github/contributors/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=brightgreen)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-bienvenidos-brightgreen.svg?style=for-the-badge)](https://makeapullrequest.com)
[![Discussions](https://img.shields.io/github/discussions/chaishillomnitech1/scrollsoul-music-sync?style=for-the-badge&color=purple)](https://github.com/chaishillomnitech1/scrollsoul-music-sync/discussions)

**[🇺🇸 English](../../CONTRIBUTING.md)** • **🇪🇸 Español** • **[🇫🇷 Français](CONTRIBUTING.fr.md)** • **[🇩🇪 Deutsch](CONTRIBUTING.de.md)** • **[🇯🇵 日本語](CONTRIBUTING.ja.md)** • **[🇰🇷 한국어](CONTRIBUTING.ko.md)** • **[🇨🇳 中文](CONTRIBUTING.zh.md)** • **[🇧🇷 Português](CONTRIBUTING.pt.md)**

</div>

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** `>= 14.x`
- **npm** `>= 7.x`
- **Git** (última versión)

### Configuración Local

```bash
# 1. Haz un fork del repositorio

# 2. Clona tu fork
git clone https://github.com/TU_USUARIO/scrollsoul-music-sync.git
cd scrollsoul-music-sync

# 3. Agrega el repositorio original como remoto
git remote add upstream https://github.com/chaishillomnitech1/scrollsoul-music-sync.git

# 4. Instala las dependencias
npm install

# 5. Copia la plantilla de variables de entorno
cp .env.example .env

# 6. Inicia en modo desarrollo
npm run dev

# 7. Verifica que todo funciona
npm test
```

---

## 🎯 Cómo Contribuir

### 1. Crea una Rama

```bash
git checkout main
git pull upstream main
git checkout -b feature/nombre-de-tu-funcionalidad
```

**Convenciones de nombres para ramas:**

| Tipo | Patrón | Ejemplo |
|:---|:---|:---|
| ✨ Funcionalidad | `feature/descripcion` | `feature/agregar-oauth-spotify` |
| 🐛 Corrección | `fix/descripcion` | `fix/error-calculo-royalties` |
| 📝 Documentación | `docs/descripcion` | `docs/actualizar-api-referencia` |

### 2. Realiza tus Cambios

- Mantén los cambios **enfocados** — una funcionalidad o corrección por PR
- Sigue los patrones de código existentes
- Agrega o actualiza **pruebas** para todos los cambios

### 3. Verifica tus Cambios

```bash
npm test       # Ejecutar todas las pruebas
npm run lint   # Verificar estilo de código
npm run build  # Compilar el proyecto
```

### 4. Envía un Pull Request

1. Sube tu rama: `git push origin feature/nombre-de-tu-funcionalidad`
2. Abre un PR contra la rama `main`
3. Completa la plantilla de PR
4. Solicita una revisión

---

## 📝 Estándares de Commits

Seguimos **Conventional Commits**:

```
feat(licencias): agregar cálculo de royalties por territorio
fix(api): corregir patrón regex de validación ISRC
docs(readme): actualizar guía de contribución multilingüe
```

---

## 🏆 Reconocimiento

¡Todos los contribuidores son celebrados! Los contribuidores aparecen en:
- 📜 La sección de [Contribuidores del README](../../README.md)
- 🌟 El [CHANGELOG.md](../../CHANGELOG.md) por cada PR fusionado

---

<div align="center">

## 💜 ¡Gracias!

Eres una parte vital de este ecosistema soberano. 🌌

</div>
