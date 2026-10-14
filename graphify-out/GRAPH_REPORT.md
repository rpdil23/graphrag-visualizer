# Graph Report - graphrag-visualizer  (2026-10-14)

## Corpus Check
- 51 files · ~38,539 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .ico 1)

## Summary
- 299 nodes · 503 edges · 25 communities (18 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1fab50d8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- DataTableContainer.tsx
- dependencies
- GraphViewer.tsx
- GraphDataHandler.tsx
- compilerOptions
- react-table-config.d.ts
- manifest.json
- parquet-utils.ts
- scripts
- GraphRAG Visualizer
- hyparquet.d.ts
- declarations.d.ts
- AGENTS.md - Devmind Directives & Engineering Rules
- Code Structure & Boundaries
- diagram-design
- search.md
- search-docs.md
- search-knowledge.md
- todo.md

## God Nodes (most connected - your core abstractions)
1. `react` - 16 edges
2. `compilerOptions` - 16 edges
3. `@mui/material` - 12 edges
4. `material-react-table` - 12 edges
5. `DataTableContainerProps` - 12 edges
6. `GraphDataHandler()` - 10 edges
7. `CustomNode` - 10 edges
8. `@mui/icons-material` - 8 edges
9. `CustomLink` - 8 edges
10. `scripts` - 7 edges

## Surprising Connections (you probably didn't know these)
- `1. Layer Boundaries` --references--> `useFileHandler()`  [INFERRED]
  .agents/rules/code-structure.md → src/app/hooks/useFileHandler.ts
- `1. Layer Boundaries` --references--> `useGraphData()`  [INFERRED]
  .agents/rules/code-structure.md → src/app/hooks/useGraphData.ts
- `GraphViewer()` --calls--> `DetailDrawer()`  [EXTRACTED]
  src/app/components/GraphViewer.tsx → src/app/components/DetailDrawer.tsx
- `GraphViewerProps` --references--> `CustomGraphData`  [EXTRACTED]
  src/app/components/GraphViewer.tsx → src/app/models/custom-graph-data.ts
- `useFileHandler()` --calls--> `readParquetFile()`  [EXTRACTED]
  src/app/hooks/useFileHandler.ts → src/app/utils/parquet-utils.ts

## Import Cycles
- None detected.

## Communities (25 total, 7 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (34): browserslist, development, production, devDependencies, gh-pages, @types/d3-force, @types/react-table, @types/three (+26 more)

### Community 1 - "DataTableContainer.tsx"
Cohesion: 0.13
Nodes (34): material-react-table, DataTable(), DataTableProps, DataTableContainer(), DataTableContainerProps, DetailDrawer(), GraphReportView(), baseFileNames (+26 more)

### Community 2 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, axios, d3-force, @emotion/react, @emotion/styled, fuse.js, hyparquet, material-react-table (+23 more)

### Community 3 - "GraphViewer.tsx"
Cohesion: 0.08
Nodes (32): axios, d3-force, fuse.js, react-force-graph-2d, react-force-graph-3d, three, three-spritetext, agent (+24 more)

### Community 4 - "GraphDataHandler.tsx"
Cohesion: 0.12
Nodes (23): 1. Layer Boundaries, @mui/icons-material, @mui/material, react, react-ga4, react-router-dom, web-vitals, DropZone() (+15 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+9 more)

### Community 6 - "react-table-config.d.ts"
Cohesion: 0.18
Nodes (10): react-table, Cell, ColumnInstance, ColumnInterface, Hooks, react-table, Row, TableInstance (+2 more)

### Community 7 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 8 - "parquet-utils.ts"
Cohesion: 0.36
Nodes (4): hyparquet, AsyncBuffer, parseValue(), readParquetFile()

### Community 9 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, deploy, eject, predeploy, start, test

### Community 10 - "GraphRAG Visualizer"
Cohesion: 0.15
Nodes (12): Developer Instructions, Features, Graph Data Model, GraphRAG Visualizer, Important Note, Loading Graphify Files, Loading Parquet Files, Nodes (+4 more)

### Community 15 - "AGENTS.md - Devmind Directives & Engineering Rules"
Cohesion: 0.29
Nodes (6): AGENTS.md - Devmind Directives & Engineering Rules, Architecture README sync, Caveman response style, Code Structure, diagram-design, graphify

### Community 16 - "Code Structure & Boundaries"
Cohesion: 0.40
Nodes (4): 2. Size Limits, 3. Oversized Files (Grandfathered), 4. Verification Steps, Code Structure & Boundaries

### Community 17 - "diagram-design"
Cohesion: 0.50
Nodes (3): Animation Rules (Pure Inline SVG), diagram-design, Diagram theme

### Community 18 - "search.md"
Cohesion: 0.50
Nodes (3): Answer format, Rules, Strategy

### Community 19 - "search-docs.md"
Cohesion: 0.50
Nodes (3): Answer format, Rules, Strategy

### Community 20 - "search-knowledge.md"
Cohesion: 0.50
Nodes (3): Answer format, Rules, Strategy

### Community 21 - "todo.md"
Cohesion: 0.50
Nodes (3): Commands, Instructions, Storage format

## Knowledge Gaps
- **17 isolated node(s):** `@emotion/react`, `@emotion/styled`, `@testing-library/react`, `@testing-library/user-event`, `@types/jest` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 163 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **What connects `@emotion/react`, `@emotion/styled`, `@testing-library/react` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Why does `react` connect `GraphDataHandler.tsx` to `package.json`, `DataTableContainer.tsx`, `GraphViewer.tsx`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Should `DataTableContainer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12950971322849214 - nodes in this community are weakly interconnected._
- **Why does `react-table` connect `react-table-config.d.ts` to `package.json`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._