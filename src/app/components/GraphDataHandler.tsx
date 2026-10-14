import React, { useState, useEffect, Suspense, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Tab,
  Tabs,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import DropZone from "./DropZone";
import Introduction from "./Introduction";
import useFileHandler from "../hooks/useFileHandler";
import useGraphData from "../hooks/useGraphData";
import ReactGA from "react-ga4";

const GraphViewer = lazy(() => import("./GraphViewer"));
const DataTableContainer = lazy(() => import("./DataTableContainer"));

const getTabIndexFromPathname = (pathname: string): number => {
  switch (pathname) {
    case "/graph":
      return 1;
    case "/data":
      return 2;
    default:
      return 0;
  }
};

const GraphDataHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabIndex = getTabIndexFromPathname(location.pathname);
  const [graphType, setGraphType] = useState<"2d" | "3d">("2d");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>("entities");
  const [includeDocuments, setIncludeDocuments] = useState(false);
  const [includeTextUnits, setIncludeTextUnits] = useState(false);
  const [includeCommunities, setIncludeCommunities] = useState(false);
  const [includeCovariates, setIncludeCovariates] = useState(false);
  const [maxEntities, setMaxEntities] = useState(500);

  const {
    dataSource,
    setDataSource,
    entities,
    relationships,
    documents,
    textunits,
    communities,
    covariates,
    communityReports,
    graphifyData,
    graphifyReport,
    graphifyManifest,
    graphifyCommunities,
    handleFilesRead,
    loadDefaultFiles,
  } = useFileHandler();

  const graphData = useGraphData(
    entities,
    relationships,
    documents,
    textunits,
    communities,
    communityReports,
    covariates,
    includeDocuments,
    includeTextUnits,
    includeCommunities,
    includeCovariates,
    maxEntities,
    dataSource,
    graphifyData,
  );

  const hasDocuments = documents.length > 0;
  const hasTextUnits = textunits.length > 0;
  const hasCommunities = communities.length > 0;
  const hasCovariates = covariates.length > 0;

  const hasGraphRAG = entities.length > 0;
  const hasGraphify = Boolean(graphifyData && graphifyData.nodes.length > 0);

  const totalEntities =
    dataSource === "graphify"
      ? (graphifyData?.nodes?.length || 0)
      : entities.length;

  useEffect(() => {
    if (dataSource === "graphify") {
      setSelectedTable((prev: string) =>
        ["nodes", "links", "communities", "report", "manifest"].includes(prev)
          ? prev
          : "nodes",
      );
    } else {
      setSelectedTable((prev: string) =>
        [
          "entities",
          "relationships",
          "documents",
          "textunits",
          "communities",
          "communityReports",
          "covariates",
        ].includes(prev)
          ? prev
          : "entities",
      );
    }
  }, [dataSource]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      loadDefaultFiles();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (measurementId) {
      ReactGA.initialize(measurementId);
    } else {
      console.error("Google Analytics measurement ID not found");
    }
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    handleFilesRead(acceptedFiles);
    navigate("/graph", { replace: true });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: true,
    accept: {
      "application/x-parquet": [".parquet"],
      "application/json": [".json"],
      "text/markdown": [".md"],
      "text/plain": [".json", ".md"],
    },
  });

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    let path = "/upload";
    if (newValue === 1) path = "/graph";
    if (newValue === 2) path = "/data";
    navigate(path);
    ReactGA.send({
      hitType: "event",
      eventCategory: "Tabs",
      eventAction: "click",
      eventLabel: `Tab ${newValue}`,
    });
  };

  const toggleGraphType = () => {
    setGraphType((prevType) => (prevType === "2d" ? "3d" : "2d"));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Upload Artifacts" />
          <Tab label="Graph Visualization" />
          <Tab label="Data Tables" />
        </Tabs>

        {hasGraphRAG && hasGraphify && tabIndex > 0 && (
          <Box
            sx={{
              position: "absolute",
              right: 16,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ToggleButtonGroup
              value={dataSource}
              exclusive
              onChange={(_, val) => val && setDataSource(val)}
              size="small"
            >
              <ToggleButton value="graphrag" sx={{ px: 1.5, py: 0.25, fontSize: "0.75rem" }}>
                GraphRAG
              </ToggleButton>
              <ToggleButton value="graphify" sx={{ px: 1.5, py: 0.25, fontSize: "0.75rem" }}>
                Graphify
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
      </Box>

      {tabIndex === 0 && (
        <Container
          maxWidth="md"
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DropZone
            {...{ getRootProps, getInputProps, isDragActive }}
            onFolderSelect={onDrop}
          />
          <Introduction />
        </Container>
      )}

      {tabIndex === 1 && (
        <Box
          p={3}
          sx={{
            height: isFullscreen ? "100vh" : "calc(100vh - 64px)",
            width: isFullscreen ? "100vw" : "100%",
            position: isFullscreen ? "fixed" : "relative",
            top: 0,
            left: 0,
            zIndex: isFullscreen ? 1300 : "auto",
            overflow: "hidden",
          }}
        >
          <Suspense
            fallback={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <CircularProgress size={44} />
              </Box>
            }
          >
            <GraphViewer
              data={graphData}
              graphType={graphType}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              onToggleGraphType={toggleGraphType}
              includeDocuments={includeDocuments}
              includeTextUnits={includeTextUnits}
              onIncludeDocumentsChange={() =>
                setIncludeDocuments(!includeDocuments)
              }
              onIncludeTextUnitsChange={() =>
                setIncludeTextUnits(!includeTextUnits)
              }
              includeCommunities={includeCommunities}
              onIncludeCommunitiesChange={() =>
                setIncludeCommunities(!includeCommunities)
              }
              includeCovariates={includeCovariates}
              onIncludeCovariatesChange={() =>
                setIncludeCovariates(!includeCovariates)
              }
              hasDocuments={hasDocuments}
              hasTextUnits={hasTextUnits}
              hasCommunities={hasCommunities}
              hasCovariates={hasCovariates}
              maxEntities={maxEntities}
              onMaxEntitiesChange={setMaxEntities}
              totalEntities={totalEntities}
              dataSource={dataSource}
            />
          </Suspense>
        </Box>
      )}

      {tabIndex === 2 && (
        <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
          <Suspense
            fallback={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <CircularProgress size={44} />
              </Box>
            }
          >
            <DataTableContainer
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              entities={entities}
              relationships={relationships}
              documents={documents}
              textunits={textunits}
              communities={communities}
              communityReports={communityReports}
              covariates={covariates}
              dataSource={dataSource}
              setDataSource={setDataSource}
              graphifyNodes={graphifyData?.nodes || []}
              graphifyLinks={graphifyData?.links || []}
              graphifyCommunities={graphifyCommunities}
              graphifyReport={graphifyReport}
              graphifyManifest={graphifyManifest}
            />
          </Suspense>
        </Box>
      )}
    </>
  );
};

export default GraphDataHandler;
