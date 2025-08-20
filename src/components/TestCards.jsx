import React,{useState}from "react";
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
  Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useLocation,useNavigate } from "react-router-dom";
import Breadcrumbs from "./BreadCrumb";
const TestCards = ({ onViewStats, onDelete }) => {
  const location = useLocation();
  const folderName = location.state?.folder?.name || "";
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(""); 
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
    setName(folder.name);
    setOpenModal(true);
  };

  const handleSave = () => {
    if (isEditing && modalType === "folder") {
      onEditFolder(editId, name);
    } else if (modalType === "folder") {
      onAddFolder(name);
    } else if (modalType === "test") {
      onAddTest(name);
    }
    setOpenModal(false);
  };

  // Sample data — 3 tests for each folder
  const allTests = [
    // Cardiology Test
    {
      id: 101,
      folderName: "Cardiology Test",
      title: "General Knowledge",
      organization: "TechCryptors",
      status: "Completed",
      startDate: "07/09/2025, 12:00 AM",
      endDate: "07/09/2025, 11:59 PM",
    },
    {
      id: 102,
      folderName: "Cardiology Test",
      title: "Cardio Fitness",
      organization: "HeartCare Labs",
      status: "Upcoming",
      startDate: "10/09/2025, 10:00 AM",
      endDate: "10/09/2025, 2:00 PM",
    },
    {
      id: 103,
      folderName: "Cardiology Test",
      title: "Heart Health Basics",
      organization: "CardioLife",
      status: "Alloted",
      startDate: "15/09/2025, 9:00 AM",
      endDate: "15/09/2025, 10:00 AM",
    },

    // Neurology Test
    {
      id: 201,
      folderName: "Neurology Test",
      title: "Brain Reflex Test",
      organization: "NeuroMind Clinic",
      status: "Completed",
      startDate: "05/09/2025, 1:00 PM",
      endDate: "05/09/2025, 3:00 PM",
    },
    {
      id: 202,
      folderName: "Neurology Test",
      title: "Neuro Cognitive Skills",
      organization: "MindPlus Labs",
      status: "Upcoming",
      startDate: "12/09/2025, 2:00 PM",
      endDate: "12/09/2025, 4:00 PM",
    },
    {
      id: 203,
      folderName: "Neurology Test",
      title: "Brain Health Basics",
      organization: "NeuroLife",
      status: "Completed",
      startDate: "20/09/2025, 10:00 AM",
      endDate: "20/09/2025, 11:00 AM",
    },

    // Orthopedics Test
    {
      id: 301,
      folderName: "Orthopedics Test",
      title: "Bone Strength Check",
      organization: "OrthoPlus",
      status: "Completed",
      startDate: "01/08/2025, 9:00 AM",
      endDate: "01/08/2025, 10:00 AM",
    },
    {
      id: 302,
      folderName: "Orthopedics Test",
      title: "Joint Flexibility Test",
      organization: "FlexiCare",
      status: "Upcoming",
      startDate: "08/08/2025, 11:00 AM",
      endDate: "08/08/2025, 12:00 PM",
    },
    {
      id: 303,
      folderName: "Orthopedics Test",
      title: "Posture Analysis",
      organization: "SpineCare",
      status: "Completed",
      startDate: "15/08/2025, 2:00 PM",
      endDate: "15/08/2025, 3:00 PM",
    },
  ];

  // Filter tests for the selected folder
  const tests = allTests.filter((t) => t.folderName === folderName);

  return (
    <Box padding={3}>
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

      {tests.map((test) => (
        <Card
          key={test.id}
          sx={{
            backgroundColor: "#e9f6e9",
            borderRadius: 2,
            boxShadow: "none",
            mb: 2,
            px: 2,
            py: 1,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              p: "8px !important",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {test.title} - {test.organization}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {test.startDate} - {test.endDate}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                mt: 1,
              }}
            >
              <Chip
                label={test.status}
                size="small"
                sx={{
                  backgroundColor: "#ffeb3b",
                  color: "#000",
                  fontWeight: 500,
                }}
              />
            </Box>

            <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
              <Button
                variant="text"
                size="small"
                sx={{ p: 0, textTransform: "none", color: "primary.main" }}
                onClick={() => navigate('/add-questions',{state:{testName:test.title}})}
              >
                Add Questions
              </Button>
              <Button
                variant="text"
                size="small"
                sx={{ p: 0, textTransform: "none", color: "error.main" }}
                onClick={() => onDelete?.(test)}
              >
                Delete Test
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
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
                  onChange={(e) => setName(e.target.value)}
                />
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
};

export default TestCards;
