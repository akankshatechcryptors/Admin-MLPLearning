import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Paper,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumbs from "./BreadCrumb";
import { useNavigate } from "react-router-dom";

export default function TestFoldersList({
  folders,
  onSelectFolder,
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
  onAddTest,
}) {
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

  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [desc ,setDesc]=useState(DEFAULT_INSTRUCTIONS)
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleOptionClick = (type) => {
    setModalType(type);
    setName("");
    setIsEditing(false);
    setOpenModal(true);
    handleMenuClose();
  };

  const handleEditClick = (folder) => {
    setModalType("folder");
    setIsEditing(true);
    setEditId(folder.id);
    setName(folder.title);
    setOpenModal(true);
  };

  const handleSave = () => {
    if (isEditing && modalType === "folder") {
      onEditFolder(editId, name);
    } else if (modalType === "folder") {
      onAddFolder(name);
    } else if (modalType === "test") {
      onAddTest(name,desc);
    }
    setOpenModal(false);
  };

  const handleFolderClick = (folder) => {
    if (onSelectFolder) onSelectFolder(folder);
   const folderSlug = folder.title.replace(/\s+/g, "-");
    navigate(`/tests/${folderSlug}`,{state:{folder:folder,id:folder.id}});
  };

  return (
    <Box>
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
          sx={{ borderRadius: '50px', '&:hover': { backgroundColor: '#e3f2ff' } }}
          onClick={handleMenuOpen}
        >
          Create
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleOptionClick("folder")}>Add Folder</MenuItem>
          <MenuItem onClick={() => handleOptionClick("test")}>Add Test</MenuItem>
        </Menu>
      </Box>

      {/* Cards Container */}
      <Box
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        gap={5}
        p={2}
        sx={{
          bgcolor: "transparent",
        }}
      >
        {folders.map((folder) => (
          <Card
            key={folder.id}
            sx={{
              width: 220,
              height: 120,
              bgcolor: "#e6f4e6",
              borderRadius: "16px",
              cursor: "pointer",
              position: "relative",
              border: "1px solid #d0e4d0",
              transition: "all 0.2s ease",
              "&:hover": { backgroundColor: "#d9f0d9" },
            }}
            onClick={() => handleFolderClick(folder)}
          >
            {/* Edit Icon */}
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "white",
                "&:hover": { background: "#f5f5f5" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(folder);
              }}
            >
              <EditIcon fontSize="small" sx={{ color: "#000" }} />
            </IconButton>

            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 1,
                padding: "0px !important",
              }}
            >
              <FolderIcon sx={{ fontSize: 40, color: "#000" }} />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{
                  color: "#000",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "90%",
                }}
              >
                {folder.title}
              </Typography>
            </CardContent>

            {/* Delete Icon */}
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                background: "white",
                "&:hover": { background: "#f5f5f5" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFolder(folder);
              }}
            >
              <DeleteIcon fontSize="small" sx={{ color: "#000" }} />
            </IconButton>
          </Card>
        ))}
      </Box>

      {/* Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>
          {isEditing
            ? "Edit Folder"
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
            onChange={(e) => setName(e.target.value.replace(/"/g, ""))}
          />
          {modalType==='test' &&(<>
          <TextField
            autoFocus
            margin="dense"
            label="Instructions"
                fullWidth
                multiline
                rows={8}
            value={desc}
            onChange={(e) => setDesc(e.target.value.replace(/"/g, ""))}
          />
          </>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!name.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
