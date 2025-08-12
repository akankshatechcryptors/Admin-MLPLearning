import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";

export default function UploadExcelModal({
  open,
  onClose,
  sampleFile = "/assets/sample.xlsx",
  onUpload,
  sections = [] // Pass array of sections [{name: "Math"}, {name: "Science"}]
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedSection) {
      alert("Please select a section first.");
      return;
    }
    if (!selectedFile) {
      alert("Please upload an Excel file.");
      return;
    }
    onUpload && onUpload(selectedSection, selectedFile);
    setSelectedSection("");
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Questions (Excel)</DialogTitle>
      <DialogContent>
        {/* Section Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Section</InputLabel>
          <Select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            {sections.map((sec, index) => (
              <MenuItem key={index} value={sec.name}>
                {sec.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Drag & Drop Upload */}
        <Box
          onClick={() => document.getElementById("excelInput").click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            border: `2px dashed ${dragActive ? "#0077B6" : "#ccc"}`,
            borderRadius: "15px",
            p: 4,
            textAlign: "center",
            bgcolor: dragActive ? "#e3f2fd" : "transparent",
            cursor: "pointer",
            mt: 2
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 40, color: "#0077B6" }} />
          <Typography variant="body1" mt={1}>
            Drag & drop your Excel file here, or click to browse
          </Typography>
          {selectedFile && (
            <Typography variant="body2" mt={1}>
              Selected: {selectedFile.name}
            </Typography>
          )}
        </Box>

        <input
          type="file"
          id="excelInput"
          hidden
          accept=".xlsx, .xls"
          onChange={handleFileSelect}
        />

        {/* Download Sample */}
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          href={sampleFile}
          download
          sx={{
            mt: 2,
            borderRadius: "20px",
            color: "#0077B6",
            borderColor: "#0077B6",
            "&:hover": { borderColor: "#0077B6", color: "#0077B6" }
          }}
        >
          Download Sample Excel
        </Button>
      </DialogContent>

      {/* Modal Actions */}
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ borderRadius: "20px", color: "#0077B6" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#0077B6",
            "&:hover": { bgcolor: "#0077B6" },
            borderRadius: "20px"
          }}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
