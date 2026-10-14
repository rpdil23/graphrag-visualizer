# AGENTS.md - Devmind Directives & Engineering Rules

## Caveman response style

For every new conversation in this repository, read and apply the
Caveman skill at:
C:/Users/ramst/.agents/skills/caveman/SKILL.md

Use Caveman style for chat replies by default. Preserve all technical
details. Keep code, comments, documentation, and other saved content
in normal prose. Continue following all engineering rules below.

If I say "stop caveman" or "normal mode", stop using this style for
the remainder of the conversation unless I enable it again.

---

## graphify
See `.agents/rules/graphify.md` (always-on rule) for graphify query/update directives.

---

## diagram-design

When creating or editing diagrams in `docs/diagrams/`, load the **diagram-design** skill (`.agents/skills/diagram-design/SKILL.md`) for the full pastel-glow theme spec, colour tokens, and SVG animation rules.

---

## Architecture README sync
`README.md` in this repo is the **master architecture document** for the Devmind application (Tauri Rust native core, React frontend, native in-process MCP tools, Android APK build guide, Google Drive & Turso sync engines).
After a significant feature or change in this repo, update `README.md` in the same change. Significant means: a new Tauri command or backend module; a new MCP tool or tool schema; a database schema or migration change; a new sync provider or OAuth flow; build flags or Android prerequisites; or a notable security or performance change. Skip refactors, bug fixes, and minor UI adjustments.
Rules:
- Verify against code, `src-tauri/Cargo.toml`, `package.json`, and `.env.example`, not against old docs. Do not copy unverified numbers, ports, or versions.
- If you only changed code and did not touch `README.md`, explain in your final summary why none was needed.

## Code Structure
See `.agents/rules/code-structure.md` (always-on rule) for layer boundaries, the oversized-file list, function/file size limits, and development-mode verification steps.
