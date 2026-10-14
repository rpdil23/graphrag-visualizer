import React, { useRef } from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface DropZoneProps {
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
  onFolderSelect?: (files: File[]) => void;
}

const DropZone: React.FC<DropZoneProps> = ({
  getRootProps,
  getInputProps,
  isDragActive,
  onFolderSelect,
}) => {
  const theme = useTheme();
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).filter(
        (file) =>
          file.name.endsWith(".parquet") ||
          file.name.endsWith(".json") ||
          file.name.endsWith(".md"),
      );
      if (onFolderSelect) {
        onFolderSelect(filesArray);
      }
    }
  };

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed gray",
        borderRadius: "8px",
        padding: "24px",
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: isDragActive
          ? theme.palette.action.hover
          : theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "170px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        mb: 2,
        transition: "border-color 0.2s ease, background-color 0.2s ease",
        "&:hover": {
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <input {...getInputProps()} />
      <input
        ref={folderInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFolderChange}
        {...({ webkitdirectory: "true", directory: "true" } as any)}
      />

      <UploadFileIcon
        sx={{ fontSize: 44, color: theme.palette.primary.main, opacity: 0.85 }}
      />

      {isDragActive ? (
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Drop files or folder here...
        </Typography>
      ) : (
        <>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Drag &amp; drop files or folder here, or click to browse
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
            <Chip
              label="GraphRAG (.parquet)"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 500, fontSize: "0.75rem" }}
            />
            <Chip
              label="Graphify (graph.json / graphify-out)"
              size="small"
              color="secondary"
              variant="outlined"
              sx={{ fontWeight: 500, fontSize: "0.75rem" }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Supports GraphRAG parquet tables or Graphify knowledge graph outputs (.json, .md)
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, mt: 0.5 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FolderOpenIcon />}
              onClick={(e) => {
                e.stopPropagation();
                folderInputRef.current?.click();
              }}
            >
              Upload Folder
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DropZone;
