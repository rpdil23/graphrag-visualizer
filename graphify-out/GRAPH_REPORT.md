# Graph Report - graphrag-visualizer  (2026-10-13)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 217 nodes · 386 edges · 15 communities (11 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8648cde8`
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
- agent.ts
- hyparquet.d.ts
- declarations.d.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `react` - 14 edges
3. `material-react-table` - 11 edges
4. `@mui/material` - 11 edges
5. `GraphDataHandler()` - 9 edges
6. `DataTableContainerProps` - 8 edges
7. `CustomNode` - 8 edges
8. `CustomLink` - 7 edges
9. `scripts` - 7 edges
10. `GraphViewer()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `DetailDrawer()` --calls--> `DataTable()`  [EXTRACTED]
  src/app/components/DetailDrawer.tsx → src/app/components/DataTable.tsx
- `GraphDataHandler()` --calls--> `GraphViewer()`  [EXTRACTED]
  src/app/components/GraphDataHandler.tsx → src/app/components/GraphViewer.tsx
- `useFileHandler()` --calls--> `readParquetFile()`  [EXTRACTED]
  src/app/hooks/useFileHandler.ts → src/app/utils/parquet-utils.ts
- `DataTableContainerProps` --references--> `Community`  [EXTRACTED]
  src/app/components/DataTableContainer.tsx → src/app/models/community.ts
- `DataTableContainerProps` --references--> `CommunityReport`  [EXTRACTED]
  src/app/components/DataTableContainer.tsx → src/app/models/community-report.ts

## Import Cycles
- None detected.

## Communities (15 total, 4 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (32): browserslist, development, production, devDependencies, gh-pages, @types/react-table, @types/three, eslintConfig (+24 more)

### Community 1 - "DataTableContainer.tsx"
Cohesion: 0.21
Nodes (20): material-react-table, DataTableContainerProps, baseFileNames, baseMapping, fileSchemas, Community, communityColumns, CommunityReport (+12 more)

### Community 2 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, axios, @emotion/react, @emotion/styled, fuse.js, hyparquet, material-react-table, @mui/icons-material (+22 more)

### Community 3 - "GraphViewer.tsx"
Cohesion: 0.14
Nodes (22): fuse.js, @mui/icons-material, react-force-graph-2d, react-force-graph-3d, three, three-spritetext, APISearchDrawer(), APISearchDrawerProps (+14 more)

### Community 4 - "GraphDataHandler.tsx"
Cohesion: 0.15
Nodes (17): @mui/material, react, react-ga4, react-router-dom, web-vitals, DataTable(), DataTableProps, DataTableContainer() (+9 more)

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

### Community 10 - "agent.ts"
Cohesion: 0.29
Nodes (5): axios, agent, requests, Search, Status

## Knowledge Gaps
- **16 isolated node(s):** `@emotion/react`, `@emotion/styled`, `gh-pages`, `react-app`, `react-app/jest` (+11 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 117 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.206) - this node is a cross-community bridge._
- **What connects `@emotion/react`, `@emotion/styled`, `gh-pages` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Why does `react` connect `GraphDataHandler.tsx` to `package.json`, `DataTableContainer.tsx`, `GraphViewer.tsx`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `react-table` connect `react-table-config.d.ts` to `package.json`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `GraphViewer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._