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

export default function TestFoldersList({
  folders,
  onSelectFolder,
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
  onAddTest,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "folder" or "test"
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

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

  return (
    <Paper sx={{ p: 2, bgcolor: "transparent", boxShadow: "none" }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Breadcrumbs/>
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
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
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
            onClick={() => onSelectFolder(folder)}
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
                {folder.name}
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
            label={
              modalType === "folder" ? "Folder Name" : "Test Name"
            }
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
    </Paper>
  );
}
