# AI Release Instructions

Use this file when an AI needs to generate the next release note for this project.

## Goal

Generate a new Markdown release note inside `.releases/` for the current project version.

## Files to use

- `.releases/docs/release.md`: primary instruction file
- existing release files inside `.releases/`: style references
- `package.json`: source of the current version

## Required behavior

1. Read `package.json` and get the current `version`.
2. Find the previous release file and previous git tag.
3. Compare the previous tag against `HEAD`.
4. Inspect commits, diff stat, diff name-only, and the relevant code files.
5. Generate a new file named `.releases/v<version>.md`.
6. Write the release note in English.
7. Follow the project release style.
8. Do not invent changes, routes, examples, dependency versions, or environment variables.

## Required checks

- Confirm that every new endpoint mentioned actually exists in the code.
- Confirm that every version mentioned was verified in `package.json` or the lockfile.
- Confirm that every environment variable mentioned was added in the release range.
- Prefer user-facing changes first, then internal improvements, then tooling or infrastructure.
- If no new environment variables were added, use a `### ✅ Notes` section instead of `### 🔧 New environment variables`.

## Required structure

Use this structure for the generated release note:

````md
## 🛡️ Amoxcalli Badges — vX.Y.Z

### 🆕 What's new

Feature or endpoint name

Short explanation.

```http
GET /api/example
```

```markdown
![Example](https://badges.amoxcalli.dev/api/example)
```

Short result explanation.

### ⚙️ Internal improvements

• Item 1.
• Item 2.

### 🔧 Tooling and infra

• Item 1.
• Item 2.

### ✅ Notes

• Optional note.

Short closing line, optional.
````

## Commands to run

```bash
git tag --list
git log --oneline <previous-tag>..HEAD
git diff --stat <previous-tag>..HEAD
git diff --name-only <previous-tag>..HEAD
rg "export const GET" src/app/api
rg "process\.env|env\." src
```

## Output requirements

- Create exactly one new release file inside `.releases/`.
- The file name must match the current version tag.
- The title must be `## 🛡️ Amoxcalli Badges — v<version>`.
- The content must be clean Markdown ready for GitHub Releases.
- The content must be based only on real code and real diffs.