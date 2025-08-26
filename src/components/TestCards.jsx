import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "./BreadCrumb";
import AllotTestModal from "./AllotTest";
import { getExam, addExam ,editExam,allotTest } from "../common/api";

const DEFAULT_INSTRUCTIONS = `This is a timed test; the running time is displayed on top left corner of the screen.
The bar above the question text displays the question numbers in the current section of the test. You can move to any question by clicking on the respective number.
The question screen displays the question number along with the question and respective options.
The top right of section above the question has an option to mark the question for review. You can later view the marked question.
You can mark or unmark any option you have chosen by tapping on the respective option.
The bottom left corner contains the option to move to the previous question.
The bottom right corner contains the option to move to the next question.
You can jump between sections (if allowed by tutor) by choosing the section in the bottom center drop down.
You can submit the test at any point of time by clicking the Submit button on top right corner of the screen.
Before submission, the screen shows a confirmation pop-up with the total number of questions in the test, questions answered and questions marked for review.
Test must be completed in one attempt. Test once submitted cannot be re-attempted or started again.
You should not change or close the test screen while attempting test.
If the app is closed or screen is changed more than three times by any means, the test will be submitted automatically.
After completion of test, a test summary screen will be displayed with section details & solutions.
If something goes wrong, contact your tutor and communicate the problem.`;

const TestCards = () => {
  const location = useLocation();
  const folderName = location.state?.folder?.title || "";
  const folder_id = location.state?.id || "";
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tests, setTests] = useState([]);
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS);
  const [editId, setEditId] = useState(null);
  const [openAllotModal, setOpenAllotModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update,setUpdate]=useState(false)
  const [selectedTest, setSelectedTest] = useState(null);
//console.log(selectedTest)
  const navigate = useNavigate();
const handleUpdate=()=>{
  setUpdate(!update)
}

 const handleAllotTest = async (data) => {
  console.log(data)
    try {
     const res= await allotTest(data);
     console.log(res,'test  is alloted')
      handleUpdate();
    } catch (error) {
      console.log(error);
    }
  }
  // --- Fetch tests ---
  const getExams = async () => {
    setLoading(true);
    try {
      const data = { folder_id: folder_id, group_id: "" };
      const res = await getExam(data);
      setTests(res.data.groups);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getExams();
  }, [update]);

  // Menu handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleAddTest = () => {
    setIsEditing(false);
    setName("");
    setInstructions(DEFAULT_INSTRUCTIONS);
    setOpenModal(true);
    handleMenuClose();
  };

  const handleEditTest = (test) => {
    setIsEditing(true);
    setEditId(test.id);
    setName(test.title);
    setInstructions(test.instructions || DEFAULT_INSTRUCTIONS);
    setOpenModal(true);
  };

  const handleSave = async () => {
    const trimmedName = name.trim().replace(/"/g, "");
    const trimmedInstructions = instructions.trim().replace(/"/g, "");

    if (!trimmedName) return;

    try {
      if (isEditing) {
        // TODO: implement editExam API
        const data={
          id:editId,
          title: trimmedName, 
          description: trimmedInstructions,
          folder_id
        }
        const res=await editExam(data)
        handleUpdate()
        console.log("Edit Test:", editId, trimmedName, trimmedInstructions);
      } else {
        const data = { title: trimmedName, description: trimmedInstructions, folder_id };
        await addExam(data);
       handleUpdate()
      }
    } catch (error) {
      console.error(error);
    }

    setOpenModal(false);
  };

  const handleDeleteTest = (id) => setTests((prev) => prev.filter((t) => t.id !== id));

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            gap: 2,
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "green" }} />
          <Typography variant="h6" sx={{ mt: 2, color: "gray" }}>
            Loading Tests...
          </Typography>
        </Box>
      ) : (
        <>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Breadcrumbs />
            <Typography variant="h6" fontWeight="bold">
              Tests
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ borderRadius: "50px", "&:hover": { backgroundColor: "#e3f2ff" } }}
              onClick={handleMenuOpen}
            >
              Create
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleAddTest}>Add Test</MenuItem>
            </Menu>
          </Box>

          {/* Test List */}
          {tests.map((test) => (
            <Box
              key={test.id}
              sx={{
                backgroundColor: "#e9f5e9",
                borderRadius: 1,
                p: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{ fontWeight: "bold", cursor: "pointer" }}
                  onClick={() =>
                    navigate("/add-questions", { state: { testName: test.title, instructions: test.description ,id:test.id} })
                  }
                >
                  {test.title}
                </Typography>
                {test.allocated_group_count !==0 && (
                                    <Box
                                      component="span"
                                      sx={{
                                        background: "#d4a5d4",
                                        px: 1,
                                        py: 0.3,
                                        borderRadius: 1,
                                        fontSize: "0.8rem",
                                      }}
                                    >
                                      Alloted
                                    </Box>
                                  )}
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
              {
                                  test.allocated_group_count ===0 &&(<>
                                  <Button
                                  size="small"
                                  sx={{ color: "green" }}
                                   onClick={() => {
                  setSelectedTest(test.id); // store the test object
                  setOpenAllotModal(true);
                }}
                                >
                                  Allot Test
                                </Button>
                                  </>)
                                }
                <Button size="small" sx={{ color: "green" }} onClick={() => handleEditTest(test)}>
                  Edit
                </Button>
                <Button size="small" sx={{ color: "green" }} onClick={() => handleDeleteTest(test.id)}>
                  Delete
                </Button>
              </Box>
            </Box>
          ))}

          {/* Create / Edit Test Modal */}
          <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "Edit Test" : "Add Test"}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Test Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value.replace(/"/g, ""))}
              />
              <TextField
                margin="dense"
                label="Test Instructions"
                fullWidth
                multiline
                rows={8}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value.replace(/"/g, ""))}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button onClick={handleSave} variant="contained" disabled={!name.trim()}>
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Allot Modal */}
          
                <AllotTestModal
                  open={openAllotModal}
                  onClose={() => setOpenAllotModal(false)}
                  onSubmit={handleAllotTest}
                  selectedTest={selectedTest}
                />
        </>
      )}
    </Box>
  );
};

export default TestCards;
