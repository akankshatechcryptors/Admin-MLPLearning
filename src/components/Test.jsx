  import React, { useState } from "react";
  import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Checkbox,
    FormControlLabel,
    RadioGroup,
    Radio,
  } from "@mui/material";
  import Breadcrumbs from "./BreadCrumb";
  import UploadExcelModal from "./UploadExcel";
  import { useLocation } from "react-router-dom";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  import CloudUploadIcon from "@mui/icons-material/CloudUpload";
  import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
  import EditIcon from "@mui/icons-material/Edit";
  import ContentCopyIcon from "@mui/icons-material/ContentCopy";
  import DeleteIcon from "@mui/icons-material/Delete";
  import {toast} from 'react-toastify'
  export default function TestSections() {
    const location = useLocation();
    const testName = location.state?.testName || "";

    // Sections state
    const [sections, setSections] = useState([]);
    const [sectionName, setSectionName] = useState("");
    const [sectionInstruction, setSectionInstruction] = useState("");
    const [sectionPdf, setSectionPdf] = useState(null);
    const [openSectionModal, setOpenSectionModal] = useState(false);
    const [editingSectionIndex, setEditingSectionIndex] = useState(null);

    // Upload modal
    const [uploadModalOpen, setUploadModalOpen] = useState(false);

    // Editing question state
    const [editIndex, setEditIndex] = useState(null);
    const [editSectionIndex, setEditSectionIndex] = useState(null);
    const [editData, setEditData] = useState(null);

    // Delete multiple questions state
    const [deleteMode, setDeleteMode] = useState(null);
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    // Save Section
    const handleSaveSection = () => {
      if (!sectionName.trim()) return;
      const newSections = [...sections];
      if (editingSectionIndex !== null) {
        newSections[editingSectionIndex] = {
          ...newSections[editingSectionIndex],
          name: sectionName,
          instruction: sectionInstruction,
          pdf: sectionPdf ? sectionPdf.name : newSections[editingSectionIndex].pdf,
        };
      } else {
        newSections.push({
          name: sectionName,
          instruction: sectionInstruction,
          pdf: sectionPdf ? sectionPdf.name : "",
          questions: [],
        }
      );
      }
          toast.success('Section Created Successfully')

      setSections(newSections);
      handleCloseSectionModal();
    };

    const handleCloseSectionModal = () => {
      setOpenSectionModal(false);
      setEditingSectionIndex(null);
      setSectionName("");
      setSectionInstruction("");
      setSectionPdf(null);
    };

    const handleEditSection = (index) => {
      const sec = sections[index];
      setSectionName(sec.name);
      setSectionInstruction(sec.instruction);
      setSectionPdf(sec.pdf ? { name: sec.pdf } : null);
      setEditingSectionIndex(index);
      setOpenSectionModal(true);
    };

    // Add Question
    const handleAddQuestion = (sectionIndex) => {
      const newSections = [...sections];
      newSections[sectionIndex].questions.push({
        id: Date.now(),
        text: "New Question",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: 0,
        marks: 1,
      });
      setSections(newSections);
    };

    // Copy Question
    const handleCopyQuestion = (sectionIndex, qIndex) => {
      const newSections = [...sections];
      const copy = {
        ...newSections[sectionIndex].questions[qIndex],
        id: Date.now(),
      };
      newSections[sectionIndex].questions.splice(qIndex + 1, 0, copy);
      setSections(newSections);
    };

    // Delete Question
    const handleDeleteQuestion = (sectionIndex, qIndex) => {
      const newSections = [...sections];
      newSections[sectionIndex].questions.splice(qIndex, 1);
      setSections(newSections);
    };

    // Delete Selected
    const handleDeleteSelectedQuestions = () => {
      if (deleteMode === null) return;
      const newSections = [...sections];
      newSections[deleteMode].questions = newSections[deleteMode].questions.filter(
        (q) => !selectedQuestions.includes(q.id)
      );
      setSections(newSections);
      setDeleteMode(null);
      setSelectedQuestions([]);
    };

    // Open Edit
    const handleEditOpen = (sectionIndex, qIndex) => {
      setEditSectionIndex(sectionIndex);
      setEditIndex(qIndex);
      setEditData({ ...sections[sectionIndex].questions[qIndex] });
    };

    // Save Edit
    const handleEditSave = () => {
      const newSections = [...sections];
      newSections[editSectionIndex].questions[editIndex] = editData;
      setSections(newSections);
      handleEditClose();
    };

    const handleEditClose = () => {
      setEditIndex(null);
      setEditSectionIndex(null);
      setEditData(null);
    };

    return (
      <Box className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <Box className="flex justify-between items-center mb-6 text-center">
          <Breadcrumbs />
          <Typography variant="h5" fontWeight="bold">
            {testName}
          </Typography>
          <Button
            variant="outlined"
            sx={{
              bgcolor: "transparent",
              "&:hover": { bgcolor: "#0077B6", color: "white" },
              color: "#0077B6",
              textTransform: "none",
              borderRadius: "25px",
              width: "10%",
            }}
            onClick={() => setOpenSectionModal(true)}
          >
            Add Section
          </Button>
        </Box>

        {/* Sections */}
        <Box>
          {sections.length > 0 ? (
            sections.map((sec, secIndex) => (
              <Accordion
                key={secIndex}
                sx={{
                  mb: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  bgcolor: "white",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">{sec.name}</Typography>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSection(secIndex);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                </AccordionSummary>

                <AccordionDetails sx={{ bgcolor: "white" }}>
                  {/* Action buttons ON TOP */}
                  {deleteMode === secIndex ? (
                    <Box display="flex" justifyContent="center" gap={2} mb={2}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          setDeleteMode(null);
                          setSelectedQuestions([]);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteSelectedQuestions}
                      >
                        Delete Selected
                      </Button>
                    </Box>
                  ) : (
                    <Box display="flex" justifyContent="center" gap={2} mb={2}>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "#0077B6",
                          "&:hover": { bgcolor: "#0077C4" },
                          borderRadius: "20px",
                          textTransform: "none",
                        }}
                        startIcon={<CloudUploadIcon />}
                        onClick={() => setUploadModalOpen(true)}
                      >
                        Upload
                      </Button>

                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#0077B6",
                          color: "#0077B6",
                          borderRadius: "20px",
                          textTransform: "none",
                          "&:hover": { bgcolor: "#f0f8ff" },
                        }}
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => handleAddQuestion(secIndex)}
                      >
                        Create
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteMode(secIndex)}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}

                  {/* Questions */}
                  {sec.questions.length > 0 ? (
                    sec.questions.map((q, qIndex) => (
                      <Box
                        key={q.id}
                        sx={{
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          mb: 2,
                          p: 2,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        {deleteMode === secIndex && (
                          <Checkbox
                            checked={selectedQuestions.includes(q.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedQuestions([...selectedQuestions, q.id]);
                              } else {
                                setSelectedQuestions(
                                  selectedQuestions.filter((id) => id !== q.id)
                                );
                              }
                            }}
                          />
                        )}
                        <Box flex={1}>
                          <Box
                            sx={{
                              bgcolor: "#c9dbedff",
                              p: 1,
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography fontWeight="bold">
                              Q{qIndex + 1} - {q.text}
                            </Typography>
                            <Typography fontSize="14px" color="blue">
                              Marks: {q.marks}
                            </Typography>
                          </Box>

                          <Box mt={2}>
                            {q.options.map((opt, i) => (
                              <Box key={i} display="flex" gap={1}>
                                <input
                                  type="radio"
                                  checked={i === q.correct}
                                  readOnly
                                />
                                <Typography>{opt}</Typography>
                              </Box>
                            ))}
                          </Box>

                          {deleteMode !== secIndex && (
                            <Box display="flex" gap={2} mt={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditOpen(secIndex, qIndex)}
                              >
                                <EditIcon color="primary" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleCopyQuestion(secIndex, qIndex)
                                }
                              >
                                <ContentCopyIcon color="success" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleDeleteQuestion(secIndex, qIndex)
                                }
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography color="textSecondary">
                      No questions yet. Add some!
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Box textAlign="center" p={4} bgcolor="white">
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Please create sections
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpenSectionModal(true)}
                sx={{
                  bgcolor: "#0077B6",
                  "&:hover": { bgcolor: "#0077C4" },
                  mt: 2,
                  borderRadius: "20px",
                }}
                startIcon={<AddCircleOutlineIcon />}
              >
                Add Section
              </Button>
            </Box>
          )}
        </Box>

        {/* Section Modal */}
        <Dialog open={openSectionModal} onClose={handleCloseSectionModal} fullWidth>
          <DialogTitle>
            {editingSectionIndex !== null ? "Edit Section" : "Add Section"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Section Name"
              fullWidth
              margin="normal"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
            />
            <TextField
              label="Instructions"
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
                File: {sectionPdf.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSectionModal}>Cancel</Button>
            <Button onClick={handleSaveSection} variant="contained">
              {editingSectionIndex !== null ? "Save" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Question Modal */}
        <Dialog open={!!editData} onClose={handleEditClose} fullWidth>
      <DialogTitle>Edit Question</DialogTitle>
      <DialogContent>
        <TextField
          label="Question Text"
          fullWidth
          margin="normal"
          value={editData?.text || ""}
          onChange={(e) => setEditData({ ...editData, text: e.target.value })}
        />

        <Typography mt={2}>Options (select correct answer):</Typography>
        {editData?.options?.map((opt, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
              borderRadius: 1,
              mb: 1,
              bgcolor:  "transparent",
            }}
          >
            <Radio
              checked={editData?.correct === i}
              onChange={() => setEditData({ ...editData, correct: i })}
            />
            <TextField
              label={`Option ${i + 1}`}
              fullWidth
              margin="dense"
              value={opt}
              onChange={(e) => {
                const newOpts = [...editData.options];
                newOpts[i] = e.target.value;
                setEditData({ ...editData, options: newOpts });
              }}
            />
          </Box>
        ))}

        <TextField
          label="Marks"
          type="number"
          fullWidth
          margin="dense"
          value={editData?.marks || 1}
          onChange={(e) =>
            setEditData({ ...editData, marks: Number(e.target.value) })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditClose}>Cancel</Button>
        <Button variant="contained" onClick={handleEditSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>


        {/* Upload Excel */}
        <UploadExcelModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={(file) => console.log("Uploaded Excel:", file)}
        />
      </Box>
    );
  }
