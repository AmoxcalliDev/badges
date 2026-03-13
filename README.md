# 🛡️ Amoxcalli Badges

> Badges SVG dinámicos, en tiempo real y rápidos para desarrolladores, creadores y comunidades open source.

[![Licencia: AGPL v3](https://img.shields.io/badge/Licencia-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Construido con Next.js](https://img.shields.io/badge/Construido_con-Next.js-black?logo=next.js)](https://nextjs.org/)

🇺🇸 [English version](README.en.md)

**Amoxcalli Badges** es el motor open source detrás de `badges.amoxcalli.dev`. Genera badges SVG dinámicos y altamente personalizables al vuelo. Diseñado como una alternativa moderna y de alto rendimiento a los servicios de badges tradicionales, con soporte nativo para plataformas como GitHub y un catálogo masivo de íconos offline.

## ✨ Características

- **Rápido:** Renderizado SVG del lado del servidor sin dependencias externas de imágenes.
- **Biblioteca de íconos masiva:** Impulsado por Iconify con miles de logos offline (SimpleIcons, Lucide, Tabler) sin comprometer la memoria del servidor.
- **Caché en el edge:** Optimizado para Cloudflare y GitHub Camo con headers `Cache-Control`.
- **Multi-plataforma:** Endpoints nativos para GitHub y más plataformas en constante expansión.
- **Estilo flat:** Diseño limpio con paneles bicolor y tipografía Verdana.

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Íconos | `@iconify/json` & `@iconify/utils` |
| API GitHub | `octokit` |

## 📡 API — Endpoints

Puedes usar estos badges ahora mismo en tus archivos Markdown o README.

### GitHub — Seguidores

Muestra el número de seguidores de un usuario de GitHub.

```
GET /api/v1/github/badge/followers/{username}
```

```markdown
![GitHub Followers](https://badges.amoxcalli.dev/api/v1/github/badge/followers/TU_USUARIO)
```

---

### GitHub — Contributor

Verifica si un usuario ha contribuido (PR mergeado) a una organización de GitHub. Muestra `Contributor` o `Future Contributor`.

```
GET /api/v1/github/badge/contributor/{organization}/{username}
```

```markdown
![GitHub Contributor](https://badges.amoxcalli.dev/api/v1/github/badge/contributor/TU_ORG/TU_USUARIO)
```

Más endpoints y plataformas próximamente.

---

## 🛠️ Desarrollo Local

¿Quieres correr el motor de badges en tu máquina o contribuir al proyecto?

**1. Clona el repositorio:**

```bash
git clone https://github.com/AmoxcalliDev/badges.git
cd badges
```

**2. Instala las dependencias:**

```bash
npm install
```

**3. Variables de entorno:**

Crea un archivo `.env` en la raíz del proyecto y agrega tu token de GitHub:

```env
# GitHub
GITHUB_TOKEN=tu_personal_access_token
```

**4. Inicia el servidor de desarrollo:**

```bash
npm run dev
```
