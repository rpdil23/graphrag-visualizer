import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Entity } from "../models/entity";
import { Relationship } from "../models/relationship";
import { Document } from "../models/document";
import { TextUnit } from "../models/text-unit";
import { Community } from "../models/community";
import { CommunityReport } from "../models/community-report";
import { Covariate } from "../models/covariate";
import { readParquetFile } from "../utils/parquet-utils";
import {
  GraphifyCommunity,
  GraphifyGraph,
  GraphifyLink,
  GraphifyManifestItem,
  GraphifyNode,
} from "../models/graphify";

const baseFileNames = [
  "entities.parquet",
  "relationships.parquet",
  "documents.parquet",
  "text_units.parquet",
  "communities.parquet",
  "community_reports.parquet",
  "covariates.parquet",
];

const baseMapping: { [key: string]: string } = {
  "entities.parquet": "entity",
  "relationships.parquet": "relationship",
  "documents.parquet": "document",
  "text_units.parquet": "text_unit",
  "communities.parquet": "community",
  "community_reports.parquet": "community_report",
  "covariates.parquet": "covariate",
};

const fileSchemas: { [key: string]: string } = {};
Object.entries(baseMapping).forEach(([key, value]) => {
  fileSchemas[key] = value;
  fileSchemas[`create_final_${key}`] = value;
});

function extractCommunities(
  nodes: GraphifyNode[],
  labels: Record<string, string>,
): GraphifyCommunity[] {
  const communityMap = new Map<
    number | string,
    { name: string; sampleNodes: string[]; count: number }
  >();

  nodes.forEach((n) => {
    const commId = n.community !== undefined ? n.community : "other";
    const commName =
      n.community_name ||
      labels[String(commId)] ||
      (commId !== "other" ? `Community ${commId}` : "Unassigned");

    if (!communityMap.has(commId)) {
      communityMap.set(commId, { name: commName, sampleNodes: [], count: 0 });
    }
    const entry = communityMap.get(commId)!;
    entry.count += 1;
    if (entry.sampleNodes.length < 8 && n.label) {
      entry.sampleNodes.push(n.label);
    }
  });

  return Array.from(communityMap.entries())
    .map(([id, data]) => ({
      id,
      name: data.name,
      nodeCount: data.count,
      sampleNodes: data.sampleNodes,
    }))
    .sort((a, b) => b.nodeCount - a.nodeCount);
}

const useFileHandler = () => {
  const navigate = useNavigate();

  // Active data source
  const [dataSource, setDataSource] = useState<"graphrag" | "graphify">(
    "graphrag",
  );

  // GraphRAG state
  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [textunits, setTextUnits] = useState<TextUnit[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [covariates, setCovariates] = useState<Covariate[]>([]);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(
    [],
  );

  // Graphify state
  const [graphifyData, setGraphifyData] = useState<GraphifyGraph | null>(null);
  const [graphifyReport, setGraphifyReport] = useState<string | null>(null);
  const [graphifyManifest, setGraphifyManifest] = useState<
    GraphifyManifestItem[]
  >([]);
  const [graphifyCommunities, setGraphifyCommunities] = useState<
    GraphifyCommunity[]
  >([]);
  const [graphifyLabels, setGraphifyLabels] = useState<Record<string, string>>(
    {},
  );
  const labelsRef = useRef<Record<string, string>>({});

  const handleFilesRead = async (files: File[]) => {
    await loadFiles(files);
  };

  const loadFiles = async (files: (File | string)[]) => {
    const parquetFiles: (File | string)[] = [];
    const graphifyFiles: (File | string)[] = [];

    for (const file of files) {
      const fileName =
        typeof file === "string" ? file.split("/").pop()! : file.name;
      if (fileName.endsWith(".parquet")) {
        parquetFiles.push(file);
      } else if (
        fileName.endsWith(".json") ||
        fileName.endsWith(".md") ||
        fileName.toLowerCase().includes("graphify")
      ) {
        graphifyFiles.push(file);
      }
    }

    // 1. Process Graphify files if present
    if (graphifyFiles.length > 0) {
      let loadedGraph: GraphifyGraph | null = null;
      let loadedManifest: GraphifyManifestItem[] = [];
      let loadedLabels: Record<string, string> = { ...labelsRef.current };

      for (const file of graphifyFiles) {
        const fileName =
          typeof file === "string" ? file.split("/").pop()! : file.name;

        let text = "";
        if (typeof file === "string") {
          const res = await fetch(file);
          if (res.ok) {
            text = await res.text();
          }
        } else {
          text = await file.text();
        }

        if (!text) continue;

        try {
          if (
            fileName.toLowerCase().includes("labels.json") ||
            fileName === ".graphify_labels.json"
          ) {
            const labelsObj = JSON.parse(text);
            loadedLabels = { ...loadedLabels, ...labelsObj };
            labelsRef.current = loadedLabels;
            setGraphifyLabels(loadedLabels);
          } else if (
            fileName.toLowerCase().includes("manifest.json") &&
            !fileName.includes("public_manifest")
          ) {
            const manifestObj = JSON.parse(text);
            loadedManifest = Object.entries(manifestObj).map(
              ([fPath, info]: [string, any]) => ({
                file: fPath,
                ...(typeof info === "object" ? info : {}),
              }),
            );
            setGraphifyManifest(loadedManifest);
          } else if (
            fileName.toLowerCase().includes("report.md") ||
            fileName.endsWith(".md")
          ) {
            setGraphifyReport(text);
          } else if (fileName.endsWith(".json")) {
            const parsed = JSON.parse(text);
            if (parsed.nodes && (parsed.links || parsed.edges)) {
              const nodes: GraphifyNode[] = parsed.nodes || [];
              const links: GraphifyLink[] = parsed.links || parsed.edges || [];
              loadedGraph = {
                ...parsed,
                nodes,
                links,
              };
            }
          }
        } catch (err) {
          console.error(`Error parsing Graphify file ${fileName}:`, err);
        }
      }

      if (loadedGraph) {
        setGraphifyData(loadedGraph);
        const comms = extractCommunities(loadedGraph.nodes, loadedLabels);
        setGraphifyCommunities(comms);
        setDataSource("graphify");
      }
    }

    // 2. Process Parquet files if present
    if (parquetFiles.length > 0) {
      const entitiesArray: Entity[][] = [];
      const relationshipsArray: Relationship[][] = [];
      const documentsArray: Document[][] = [];
      const textUnitsArray: TextUnit[][] = [];
      const communitiesArray: Community[][] = [];
      const communityReportsArray: CommunityReport[][] = [];
      const covariatesArray: Covariate[][] = [];

      for (const file of parquetFiles) {
        const fileName =
          typeof file === "string" ? file.split("/").pop()! : file.name;
        const schema =
          fileSchemas[fileName] || fileSchemas[`create_final_${fileName}`];

        let data;
        if (typeof file === "string") {
          const response = await fetch(file);
          if (!response.ok) {
            console.error(`Failed to fetch file ${file}: ${response.statusText}`);
            continue;
          }

          const buffer = await response.arrayBuffer();
          const blob = new Blob([buffer], { type: "application/x-parquet" });
          const fileBlob = new File([blob], fileName);
          data = await readParquetFile(fileBlob, schema);
        } else {
          data = await readParquetFile(file, schema);
        }

        if (schema === "entity") {
          entitiesArray.push(data);
        } else if (schema === "relationship") {
          relationshipsArray.push(data);
        } else if (schema === "document") {
          documentsArray.push(data);
        } else if (schema === "text_unit") {
          textUnitsArray.push(data);
        } else if (schema === "community") {
          communitiesArray.push(data);
        } else if (schema === "community_report") {
          communityReportsArray.push(data);
        } else if (schema === "covariate") {
          covariatesArray.push(data);
        }
      }

      setEntities(entitiesArray.flat());
      setRelationships(relationshipsArray.flat());
      setDocuments(documentsArray.flat());
      setTextUnits(textUnitsArray.flat());
      setCommunities(communitiesArray.flat());
      setCommunityReports(communityReportsArray.flat());
      setCovariates(covariatesArray.flat());
      setDataSource("graphrag");
    }
  };

  const checkFileExists = async (filePath: string) => {
    try {
      const response = await fetch(filePath, {
        method: "HEAD",
        cache: "no-store",
      });

      if (response.ok) {
        const contentType = response.headers.get("Content-Type") || "";
        // If server falls back to index.html for 404, reject
        if (contentType.includes("text/html")) {
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const loadDefaultFiles = async () => {
    const parquetFilesToLoad: string[] = [];

    // Check GraphRAG default files
    for (const baseName of baseFileNames) {
      const prefixedPath =
        process.env.PUBLIC_URL + `/artifacts/create_final_${baseName}`;
      const unprefixedPath = process.env.PUBLIC_URL + `/artifacts/${baseName}`;

      if (await checkFileExists(prefixedPath)) {
        parquetFilesToLoad.push(prefixedPath);
      } else if (await checkFileExists(unprefixedPath)) {
        parquetFilesToLoad.push(unprefixedPath);
      }
    }

    if (parquetFilesToLoad.length > 0) {
      await loadFiles(parquetFilesToLoad);
      navigate("/graph", { replace: true });
      return;
    }

    // Check Graphify default files
    const graphifyPaths = [
      process.env.PUBLIC_URL + "/graphify-out/graph.json",
      process.env.PUBLIC_URL + "/artifacts/graph.json",
      process.env.PUBLIC_URL + "/graphify-out/GRAPH_REPORT.md",
      process.env.PUBLIC_URL + "/graphify-out/manifest.json",
      process.env.PUBLIC_URL + "/graphify-out/.graphify_labels.json",
    ];

    const graphifyFilesToLoad: string[] = [];
    for (const p of graphifyPaths) {
      if (await checkFileExists(p)) {
        graphifyFilesToLoad.push(p);
      }
    }

    if (graphifyFilesToLoad.length > 0) {
      await loadFiles(graphifyFilesToLoad);
      navigate("/graph", { replace: true });
    } else {
      console.log("No default GraphRAG or Graphify files found in public folder.");
    }
  };

  return {
    // Active Source
    dataSource,
    setDataSource,
    // GraphRAG state
    entities,
    relationships,
    documents,
    textunits,
    communities,
    covariates,
    communityReports,
    // Graphify state
    graphifyData,
    graphifyReport,
    graphifyManifest,
    graphifyCommunities,
    graphifyLabels,
    // Handlers
    handleFilesRead,
    loadDefaultFiles,
  };
};

export default useFileHandler;
