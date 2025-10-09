import React, { useEffect, useState } from 'react';
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
  Radio,
} from '@mui/material';
import Breadcrumbs from './BreadCrumb';
import UploadExcelModal from './UploadExcel';
import { useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import {
  addSections,
  getSections,
  editSections,
  editQuestion,
  addQuestions,
  uploadQuestions,
  udpateMinScore,
  deleteSections,
  deleteQuestion
} from '../common/api';

export default function TestSections() {
  const location = useLocation();
  const testName = location.state?.testName || '';
  const testId = location.state?.id || '';
  const dateStart = location.state?.startDate || '';
  const [update, setUpdate] = useState(false);

  // check restriction
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(dateStart);
  startDate.setHours(0, 0, 0, 0);
  const restricted = startDate <= today;

  // Sections state
  const [sections, setSections] = useState([]);
  const [sectionName, setSectionName] = useState('');
  const [sectionInstruction, setSectionInstruction] = useState('');
  const [sectionPdf, setSectionPdf] = useState(null);
  const [openSectionModal, setOpenSectionModal] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState(null);
  const [minMarks, setMinMarks] = useState(1);

  // Upload modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // Editing question state
  const [editIndex, setEditIndex] = useState(null);
  const [editSectionIndex, setEditSectionIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [openMinMarksModal, setOpenMinMarksModal] = useState(false);

  // Delete multiple questions state
  const [deleteMode, setDeleteMode] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const mapBackendToFrontend = (q) => {
    return {
      id: q.id,
      text: q.question,
      options: [q.option1, q.option2, q.option3, q.option4, q.option5].filter(Boolean),
      correct: parseInt(q.answer, 10) - 1,
      marks: q.marks,
      section_id: q.section_id,
    };
  };

  const handleUpdate = () => setUpdate(!update);

  const getData = async () => {
    try {
      const res = await getSections({ exam_id: testId });
      const sectionsWithMappedQuestions = res.data.sections.map((sec) => ({
        ...sec,
        questions: sec.questions.map(mapBackendToFrontend),
      }));
      setSections(sectionsWithMappedQuestions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [update]);
console.log(sectionPdf)
  // Save Section
  const handleSaveSection = async () => {
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
      const formData = new FormData();
      formData.append('exam_id', testId);
      formData.append('title', sectionName);
      formData.append('description', sectionInstruction);
      formData.append('file', sectionPdf);
      const data=await addSections(formData);
      //console.log(data)
    }
    toast.success('Section Created Successfully');
    setSections(newSections);
    handleCloseSectionModal();
    handleUpdate();
  };

  const handleCloseSectionModal = () => {
    setOpenSectionModal(false);
    setEditingSectionIndex(null);
    setSectionName('');
    setSectionInstruction('');
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
    const newQ = {
      text: 'This is a example of MCQ',
      options: ['Option 1', ' Option 2', ' Option 3', 'Option 4'],
      correct: 2,
      marks: 1,
      section_id: sections[sectionIndex].id,
    };
    setEditSectionIndex(sectionIndex);
    setEditIndex(null);
    setEditData(newQ);
  };

  const handleCopyQuestion = (sectionIndex, qIndex) => {
    const orig = sections[sectionIndex].questions[qIndex];
    const copyQ = {
      text: orig.text,
      options: [...orig.options],
      correct: orig.correct,
      marks: orig.marks,
      section_id: sections[sectionIndex].id,
    };
    setEditSectionIndex(sectionIndex);
    setEditIndex(null);
    setEditData(copyQ);
  };

  const handleDeleteQuestion = async (sectionIndex, qIndex) => {
    const questionId = sections[sectionIndex].questions[qIndex].id;
    try {
      await deleteQuestion({ id: questionId });
      toast.success('Question deleted successfully');
      const newSections = [...sections];
      newSections[sectionIndex].questions.splice(qIndex, 1);
      setSections(newSections);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete question');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const res = await deleteSections({ section_id: sectionId });
      if (!res.data.error) {
        toast.success('Section deleted successfully');
        handleUpdate();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete section');
    }
  };

  const handleDeleteSelectedQuestions = async () => {
    if (deleteMode === null || selectedQuestions.length === 0) return;
    try {
      for (let qId of selectedQuestions) {
        await deleteQuestion({ id: qId });
      }
      toast.success('Selected questions deleted successfully');
      handleUpdate();
      setDeleteMode(null);
      setSelectedQuestions([]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete selected questions');
    }
  };

  const handleEditOpen = (sectionIndex, qIndex) => {
    setEditSectionIndex(sectionIndex);
    setEditIndex(qIndex);
    setEditData({ ...sections[sectionIndex].questions[qIndex] });
  };

  const handleUploadQuestions = async (file) => {
    if (!selectedSectionId) return;
    try {
      const formData = new FormData();
      formData.append('section_id', selectedSectionId);
      formData.append('file', file);
      await uploadQuestions(formData);
      toast.success('Questions uploaded successfully');
      handleUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadModalOpen(false);
      setSelectedSectionId(null);
    }
  };

  const handleEditSave = async () => {
    try {
      const payload = {
        question: editData.text,
        option1: editData.options[0] || '',
        option2: editData.options[1] || '',
        option3: editData.options[2] || '',
        option4: editData.options[3] || '',
        option5: editData.options[4] || '',
        answer: String(editData.correct + 1),
        marks: editData.marks,
        section_id: editData.section_id,
      };
      if (editIndex === null) {
        await addQuestions(payload);
        toast.success('Question added successfully');
      } else {
        await editQuestion({ id: editData.id, ...payload });
        toast.success('Question updated successfully');
      }
      getData();
      handleEditClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save question');
    }
  };

  const handleEditClose = () => {
    setEditIndex(null);
    setEditSectionIndex(null);
    setEditData(null);
  };

  const handleMinMarksSave = async () => {
    try {
      await udpateMinScore({ exam_id: testId, min_marks: minMarks });
      toast.success('Minimum marks updated successfully');
      setOpenMinMarksModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update minimum marks');
    }
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6 text-center">
        <Breadcrumbs />
        
{restricted &&(<>
<div>
  
</div>
<div>
  
</div>

</>)}
        {!restricted && (
          <>
            <Button
              variant="outlined"
              sx={{
                bgcolor: 'transparent',
                '&:hover': { bgcolor: '#0077B6', color: 'white' },
                color: '#0077B6',
                textTransform: 'none',
                borderRadius: '25px',
                width: '15%',
              }}
              onClick={() => setOpenMinMarksModal(true)}
            >
              Min. Marks
            </Button>
            <Button
              variant="outlined"
              sx={{
                bgcolor: 'transparent',
                '&:hover': { bgcolor: '#0077B6', color: 'white' },
                color: '#0077B6',
                textTransform: 'none',
                borderRadius: '25px',
                width: '10%',
              }}
              onClick={() => setOpenSectionModal(true)}
              startIcon={<AddCircleOutlineIcon />}
            >
              Section
            </Button>
          </>
        )}
      </Box>
<Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
          {testName}
        </Typography>
      {/* Sections */}
      <Box>
        {sections.length > 0 ? (
          sections.map((sec, secIndex) => (
            <Accordion
              key={secIndex}
              sx={{
                mb: 2,
                border: '1px solid #ddd',
                borderRadius: 2,
                bgcolor: 'white',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">{sec.title}</Typography>
              </AccordionSummary>

              {!restricted && (
                <Box display="flex" gap={1} pl={2} pt={1}>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleEditSection(secIndex); }}>
                    <EditIcon color="primary" sx={{ width: '18px' }} />
                  </IconButton>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteSection(sec.id); }}>
                    <DeleteIcon color="error" sx={{ width: '18px' }} />
                  </IconButton>
                </Box>
              )}

              <AccordionDetails sx={{ bgcolor: 'white' }}>
                {/* Section Actions */}
                {!restricted && (
                  deleteMode === secIndex ? (
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
                          bgcolor: '#0077B6',
                          '&:hover': { bgcolor: '#0077C4' },
                          borderRadius: '20px',
                          textTransform: 'none',
                        }}
                        startIcon={<CloudUploadIcon />}
                        onClick={() => {
                          setSelectedSectionId(sec.id);
                          setUploadModalOpen(true);
                        }}
                      >
                        Upload
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: '#0077B6',
                          color: '#0077B6',
                          borderRadius: '20px',
                          textTransform: 'none',
                          '&:hover': { bgcolor: '#f0f8ff' },
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
                  )
                )}

                {/* Questions */}
                {sec.questions.length > 0 ? (
                  sec.questions.map((q, qIndex) => (
                    <Box
                      key={q.id}
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        mb: 2,
                        p: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                      }}
                    >
                      {deleteMode === secIndex && !restricted && (
                        <Checkbox
                          checked={selectedQuestions.includes(q.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedQuestions([...selectedQuestions, q.id]);
                            } else {
                              setSelectedQuestions(selectedQuestions.filter((id) => id !== q.id));
                            }
                          }}
                        />
                      )}
                      <Box flex={1}>
                        <Box
                          sx={{
                            bgcolor: '#c9dbedff',
                            p: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
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
                                disabled
                              />
                              <Typography>{opt}</Typography>
                            </Box>
                          ))}
                        </Box>

                        {!restricted && deleteMode !== secIndex && (
                          <Box display="flex" gap={2} mt={1}>
                            <IconButton size="small" onClick={() => handleEditOpen(secIndex, qIndex)}>
                              <EditIcon color="primary" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleCopyQuestion(secIndex, qIndex)}>
                              <ContentCopyIcon color="success" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteQuestion(secIndex, qIndex)}>
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography color="textSecondary">No questions yet. Add some!</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Box textAlign="center" p={4} bgcolor="white">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Please create sections
            </Typography>
            {!restricted && (
              <Button
                variant="contained"
                onClick={() => setOpenSectionModal(true)}
                sx={{
                  bgcolor: '#0077B6',
                  '&:hover': { bgcolor: '#0077C4' },
                  mt: 2,
                  borderRadius: '20px',
                }}
                startIcon={<AddCircleOutlineIcon />}
              >
                Add Section
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Section Modal */}
      <Dialog open={openSectionModal} onClose={handleCloseSectionModal} fullWidth>
        <DialogTitle>{editingSectionIndex !== null ? 'Edit Section' : 'Add Section'}</DialogTitle>
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
            Upload PDF/Video
            <input
              type="file"
              accept="application/pdf,video"
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
            {editingSectionIndex !== null ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Question Modal */}
      <Dialog open={!!editData} onClose={handleEditClose} fullWidth>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          <TextField
            label="Question"
            fullWidth
            margin="normal"
            value={editData?.text || ''}
            onChange={(e) => setEditData({ ...editData, text: e.target.value })}
          />
          {editData?.options?.map((opt, i) => (
            <Box key={i} display="flex" gap={1} alignItems="center" mt={1}>
              <Radio
                checked={i === editData.correct}
                onChange={() => setEditData({ ...editData, correct: i })}
              />
              <TextField
                label={`Option ${i + 1}`}
                fullWidth
                value={opt}
                onChange={(e) => {
                  const newOptions = [...editData.options];
                  newOptions[i] = e.target.value;
                  setEditData({ ...editData, options: newOptions });
                }}
              />
            </Box>
          ))}
          <TextField
            label="Marks"
            type="number"
            fullWidth
            margin="normal"
            value={editData?.marks || 1}
            onChange={(e) => setEditData({ ...editData, marks: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Modal */}
      <UploadExcelModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUploadQuestions}
      />

      {/* Min Marks Modal */}
      <Dialog open={openMinMarksModal} onClose={() => setOpenMinMarksModal(false)} fullWidth>
        <DialogTitle>Add Minimum Marks</DialogTitle>
        <DialogContent>
          <TextField
            label="Minimum Marks"
            type="number"
            fullWidth
            margin="normal"
            value={minMarks}
            onChange={(e) => setMinMarks(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMinMarksModal(false)}>Cancel</Button>
          <Button onClick={handleMinMarksSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
