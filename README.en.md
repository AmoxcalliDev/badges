# 🛡️ Amoxcalli Badges

> Dynamic, real-time, and fast SVG badges for developers, creators, and open source communities.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Built with Next.js](https://img.shields.io/badge/Built_with-Next.js-black?logo=next.js)](https://nextjs.org/)

🇲🇽 [Versión en Español](README.md)

**Amoxcalli Badges** is the open source engine behind `badges.amoxcalli.dev`. It generates dynamic, highly customizable SVG badges on the fly. Designed as a modern, high-performance alternative to traditional badge services, with native support for platforms like GitHub and a massive offline icon catalog.

## ✨ Features

- **Fast:** Server-side SVG rendering with no external image dependencies.
- **Massive icon library:** Powered by Iconify with thousands of offline logos (SimpleIcons, Lucide, Tabler) without compromising server memory.
- **Edge caching:** Optimized for Cloudflare and GitHub Camo with `Cache-Control` headers.
- **Multi-platform:** Native endpoints for GitHub and more platforms constantly expanding.
- **Flat style:** Clean design with two-panel layout and Verdana typography.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Icons | `@iconify/json` & `@iconify/utils` |
| GitHub API | `octokit` |

## 📡 API — Endpoints

You can use these badges right now in your Markdown files or README.

### GitHub — Followers

Displays the follower count of a GitHub user.

```
GET /api/v1/github/badge/followers/{username}
```

```markdown
![GitHub Followers](https://badges.amoxcalli.dev/api/v1/github/badge/followers/YOUR_USERNAME)
```

---

### GitHub — Contributor

Checks whether a user has contributed (merged PR) to a GitHub organization. Displays `Contributor` or `Future Contributor`.

```
GET /api/v1/github/badge/contributor/{organization}/{username}
```

```markdown
![GitHub Contributor](https://badges.amoxcalli.dev/api/v1/github/badge/contributor/YOUR_ORG/YOUR_USERNAME)
```

More endpoints and platforms coming soon.

---

## 🛠️ Local Development

Want to run the badge engine on your own machine or contribute to the project?

**1. Clone the repository:**

```bash
git clone https://github.com/AmoxcalliDev/badges.git
cd badges
```

**2. Install dependencies:**

```bash
npm install
```

**3. Environment variables:**

Create a `.env` file in the root of the project and add your GitHub token:

```env
# GitHub
GITHUB_TOKEN=your_personal_access_token
```

**4. Start the development server:**

```bash
npm run dev
```
