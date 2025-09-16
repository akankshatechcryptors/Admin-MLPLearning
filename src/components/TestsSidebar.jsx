import React, { useState } from "react";
import {
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import UploadExcelModal from "./UploadExcel"; // <-- import
import { AddCircleOutline, AddIcCallOutlined, AddTask, Download } from "@mui/icons-material";

export default function CreateQuestionsPanel({ onAddMcq }) {
  const [openSectionModal, setOpenSectionModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false); // <-- for excel modal
  const [sectionName, setSectionName] = useState("");
  const [sectionInstruction, setSectionInstruction] = useState("");
  const [sectionPdf, setSectionPdf] = useState(null);
  const [sections, setSections] = useState([]);

  const handleAddSection = () => {
    if (!sectionName.trim()) return;
    setSections([
      ...sections,
      {
        name: sectionName,
        instruction: sectionInstruction,
        pdf: sectionPdf ? sectionPdf.name : ""
      }
    ]);
    handleCloseSectionModal();
  };

  const handleCloseSectionModal = () => {
    setOpenSectionModal(false);
    setSectionName("");
    setSectionInstruction("");
    setSectionPdf(null);
  };

  const handleUploadExcel = (file, section) => {
    //console.log("Uploaded File:", file);
    //console.log("For Section:", section);
    setOpenUploadModal(false);
  };

  return (
    <>
      {/* Create Question */}
      <Accordion sx={{ bgcolor: "#C1D3FE", mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Create Question</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#0077B6",
              "&:hover": { bgcolor: "#0077B6" },
              color: "white",
              textTransform: "none",
              width: "100%"
            }}
            onClick={onAddMcq}
          >
            + Add
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Test Section */}
      <Accordion sx={{ bgcolor: "#C1D3FE", mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Test Section</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {sections.map((sec, index) => (
            <Paper
              key={index}
              sx={{
                mb: 1,
                bgcolor: "#C1D3FE",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
               boxShadow:"none"
               
              }}
            >
              <Typography fontWeight="bold">{sec.name}</Typography>
              <IconButton
                color="white"
                onClick={() => onAddMcq(sec)}
                size="small"
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Paper>
          ))}
          <Button
            variant="outlined"
            sx={{
              bgcolor: "#0077B6",
              "&:hover": { bgcolor: "#0077B6" },
              color: "white",
              textTransform: "none",
              width: "100%"
            }}
            onClick={() => setOpenSectionModal(true)}
          >
            + New Section
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Import Questions */}
      <Paper sx={{ mb: 2, bgcolor: "#C1D3FE" }}>
        <Button
          fullWidth
          sx={{
            justifyContent: "space-between",
            textTransform: "none",
            color: "black",
            fontWeight: "bold",
            p: 2
          }}
          endIcon={<Download />}
          onClick={() => setOpenUploadModal(true)} // <-- open modal here
        >
         <Typography fontWeight="bold">Import Questions</Typography> 
        </Button>
      </Paper>

      {/* Allot Marks */}
      <Paper sx={{ bgcolor: "#C1D3FE" }}>
        <Button
          fullWidth
          sx={{
            justifyContent: "space-between",
            textTransform: "none",
            color: "black",
            fontWeight: "bold",
            p: 2
          }}
          endIcon={<ExpandMoreIcon />}
        >
          <Typography fontWeight="bold">Allot Marks</Typography> 
        </Button>
      </Paper>

      {/* Section Modal */}
      <Dialog open={openSectionModal} onClose={handleCloseSectionModal} fullWidth>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <TextField
            label="Section Name"
            fullWidth
            margin="normal"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
          />
          <TextField
            label="Test Instructions"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={sectionInstruction}
            onChange={(e) => setSectionInstruction(e.target.value)}
          />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
            startIcon={<CloudUploadIcon />}
          >
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => setSectionPdf(e.target.files[0])}
            />
          </Button>

          {sectionPdf && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected File: {sectionPdf.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSectionModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddSection}
            variant="contained"
            sx={{ bgcolor: "#0077B6" }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Excel Modal */}
      <UploadExcelModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        onUpload={handleUploadExcel}
        sections={sections}
      />
    </>
  );
}
