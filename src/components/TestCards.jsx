import React, { useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "./BreadCrumb";
import AllotTest from "./AllotTest";

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
  const folderName = location.state?.folder?.name || "";
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS);
  const [editId, setEditId] = useState(null);
  const [openAllotModal, setOpenAllotModal] = useState(false);
  const [extraTests, setExtraTests] = useState([]); // only user-created or edited ones

  const navigate = useNavigate();

  // --- your existing allTests stays untouched ---
  const allTests = [
    { id: 101, folderName: "Cardiology Test", title: "General Knowledge", organization: "TechCryptors", status: "Completed", startDate: "07/09/2025, 12:00 AM", endDate: "07/09/2025, 11:59 PM" },
    { id: 102, folderName: "Cardiology Test", title: "Cardio Fitness", organization: "HeartCare Labs", status: "Upcoming", startDate: "10/09/2025, 10:00 AM", endDate: "10/09/2025, 2:00 PM" },
    { id: 103, folderName: "Cardiology Test", title: "Heart Health Basics", organization: "CardioLife", status: "Alloted", startDate: "15/09/2025, 9:00 AM", endDate: "15/09/2025, 10:00 AM" },

    { id: 201, folderName: "Neurology Test", title: "Brain Reflex Test", organization: "NeuroMind Clinic", status: "Completed", startDate: "05/09/2025, 1:00 PM", endDate: "05/09/2025, 3:00 PM" },
    { id: 202, folderName: "Neurology Test", title: "Neuro Cognitive Skills", organization: "MindPlus Labs", status: "Upcoming", startDate: "12/09/2025, 2:00 PM", endDate: "12/09/2025, 4:00 PM" },
    { id: 203, folderName: "Neurology Test", title: "Brain Health Basics", organization: "NeuroLife", status: "Completed", startDate: "20/09/2025, 10:00 AM", endDate: "20/09/2025, 11:00 AM" },

    { id: 301, folderName: "Orthopedics Test", title: "Bone Strength Check", organization: "OrthoPlus", status: "Completed", startDate: "01/08/2025, 9:00 AM", endDate: "01/08/2025, 10:00 AM" },
    { id: 302, folderName: "Orthopedics Test", title: "Joint Flexibility Test", organization: "FlexiCare", status: "Upcoming", startDate: "08/08/2025, 11:00 AM", endDate: "08/08/2025, 12:00 PM" },
    { id: 303, folderName: "Orthopedics Test", title: "Posture Analysis", organization: "SpineCare", status: "Completed", startDate: "15/08/2025, 2:00 PM", endDate: "15/08/2025, 3:00 PM" },
  ];

  // Combine original + extra edits/additions
  const tests = [
    ...allTests.filter((t) => !extraTests.find((e) => e.id === t.id)),
    ...extraTests,
  ].filter((t) => t.folderName === folderName);

  // Menu handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleOptionClick = (type) => {
    setModalType(type);
    setName("");
    setInstructions(DEFAULT_INSTRUCTIONS);
    setIsEditing(false);
    setOpenModal(true);
    handleMenuClose();
  };

  const handleEditTest = (test) => {
    setModalType("test");
    setIsEditing(true);
    setEditId(test.id);
    setName(test.title);
    setInstructions(test.instructions || DEFAULT_INSTRUCTIONS);
    setOpenModal(true);
  };

  const handleSave = () => {
    if (modalType === "test") {
      if (isEditing) {
        setExtraTests((prev) => [
          ...prev.filter((t) => t.id !== editId),
          { ...allTests.find((t) => t.id === editId), id: editId, folderName, title: name, instructions },
        ]);
      } else {
        const newTest = {
          id: Date.now(),
          folderName,
          title: name,
          organization: "TechCryptors",
          status: "Upcoming",
          startDate: "",
          endDate: "",
          instructions,
        };
        setExtraTests((prev) => [...prev, newTest]);
      }
    }
    setOpenModal(false);
  };

  const handleDeleteTest = (id) =>
    setExtraTests((prev) => prev.filter((t) => t.id !== id));

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Breadcrumbs />
        <Typography variant="h6" fontWeight="bold">Tests</Typography>
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
          <MenuItem onClick={() => handleOptionClick("folder")}>Add Folder</MenuItem>
          <MenuItem onClick={() => handleOptionClick("test")}>Add Test</MenuItem>
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
                navigate("/add-questions", {
                  state: { testName: test.title, instructions: test.instructions },
                })
              }
            >
              {test.title}
            </Typography>
            {test.status === "Alloted" && (
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
            <Button size="small" sx={{ color: "green" }} onClick={() => setOpenAllotModal(true)}>
              Allot Test
            </Button>
            <Button size="small" sx={{ color: "green" }} onClick={() => handleEditTest(test)}>
              Edit
            </Button>
            <Button size="small" sx={{ color: "green" }} onClick={() => handleDeleteTest(test.id)}>
              Delete
            </Button>
          </Box>
        </Box>
      ))}

      {/* Create / Edit Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing
            ? modalType === "folder"
              ? "Edit Folder"
              : "Edit Test"
            : modalType === "folder"
            ? "Add Folder"
            : "Add Test"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={modalType === "folder" ? "Folder Name" : "Test Name"}
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {modalType === "test" && (
            <TextField
              margin="dense"
              label="Test Instructions"
              fullWidth
              multiline
              rows={8}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!name.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Allot Modal */}
      <AllotTest
        open={openAllotModal}
        onClose={() => setOpenAllotModal(false)}
        onSubmit={(data) => {
          console.log("Allot Test Data:", data);
        }}
      />
    </Box>
  );
};

export default TestCards;
