import React, { useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
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
      const filesArray = Array.from(e.target.files).filter((file) =>
        file.name.endsWith(".parquet"),
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
        minHeight: "160px",
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

      <UploadFileIcon sx={{ fontSize: 40, color: theme.palette.primary.main, opacity: 0.8 }} />

      {isDragActive ? (
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Drop the parquet files here...
        </Typography>
      ) : (
        <>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Drag &amp; drop .parquet files here, or click to select files
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Select loose files (entities, relationships, etc.) or choose an entire folder
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
