import React, { useState } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CreateQuestionsPanel from "./TestsSidebar";
import Breadcrumbs from "./BreadCrumb";
import UploadExcelModal from "./UploadExcel"; // ⬅ Import new component

export default function TestSections({ testName }) {
  const [marksModalOpen, setMarksModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleUpload = (file) => {
    console.log("Uploaded Excel file:", file);
    // Add upload logic here...
  };

  return (
    <Box p={5}>
      <Breadcrumbs />
      <Box textAlign="center" p={1}>
        <Typography variant="h5" fontWeight="bold">{testName}</Typography>
      </Box>

      <Box display="flex" gap={2} p={0}>
        {/* Left Sidebar */}
        <Box width="25%">
          <CreateQuestionsPanel onAddMcq={() => setMarksModalOpen(true)} />
        </Box>

        {/* Main Content */}
        <Box flex={1}>
          <Box display="flex" justifyContent="center" alignItems="center"
            sx={{ bgcolor: "#e3f2fd", p: 2, borderRadius: 2 }}>
            <Button size="small" sx={{ textTransform: "none", color: "#0077B6", borderRadius: "20px" }}>
              Add Test Instructions
            </Button>
          </Box>

          <Box textAlign="center" mt={4} p={4} sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h4" color="primary">?</Typography>
            <Typography variant="h6" fontWeight="bold">Let's add questions</Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              You can also add questions from the 'Import Questions' panel on left
            </Typography>
            <Button
              variant="contained"
              onClick={() => setUploadModalOpen(true)}
              sx={{
                bgcolor: "#0077B6",
                "&:hover": { bgcolor: "#0077C4" },
                mt: 2,
                textTransform: "none",
                borderRadius: "20px"
              }}
              startIcon={<CloudUploadIcon />}
            >
              Upload Questions
            </Button>
          </Box>
        </Box>

        {/* Marks Modal */}
        <Dialog open={marksModalOpen} onClose={() => setMarksModalOpen(false)}>
          <DialogTitle>Allot Marks - Multiple Choice Question</DialogTitle>
          <DialogContent>
            {["No. of questions", "Mark per question", "Negative marks", "Negative marks if unattempted"].map((label) => (
              <TextField
                key={label}
                label={label}
                type="number"
                fullWidth
                margin="dense"
                sx={{ borderRadius: "10px" }}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMarksModalOpen(false)} sx={{ borderRadius: "20px", color: "#0077B6" }}>Cancel</Button>
            <Button variant="contained" sx={{ bgcolor: "#0077B6", "&:hover": { bgcolor: "#0077B6" }, borderRadius: "20px" }}
              onClick={() => setMarksModalOpen(false)}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Upload Excel Modal */}
        <UploadExcelModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUpload}
        />
      </Box>
    </Box>
  );
}
