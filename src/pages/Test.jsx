import React, { useEffect, useState } from "react";
import TestFoldersList from "../components/TestFolder";
import Breadcrumbs from "../components/BreadCrumb";
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  CircularProgress
} from "@mui/material";
import AllotTestModal from "../components/AllotTest";
import {
  getFolder,
  addFolder,
  editFolder,
  addExam,
  getExam,
  moveFolder,
  allotTest
} from "../common/api";

export default function TestPage() {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [openAllotModal, setOpenAllotModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [folders, setFolders] = useState([]);
  const [unassignedTests, setUnassignedTests] = useState([]);
  const [loading,setLoading]=useState(false)
  
  // dropdown state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const handleUpdate = () => setUpdate(!update);

  const getFolders = async () => {
    setLoading(true)
    try {
      const res = await getFolder();
      setFolders(res.data.folders);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  const getExams = async () => {
    setLoading(true)
    const data = { folder_id: "", group_id: "" };
    try {
      const res = await getExam(data);
      console.log(res)
      setUnassignedTests(res.data.groups);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFolders();
    getExams();
  }, [update]);

  const handleAddFolder = async (name) => {
    try {
      await addFolder({ title: name });
      handleUpdate();
    } catch (error) {
      console.log(error);
    }
  };
 const handleAllotTest = async (data) => {
  console.log(data)
    try {
     const res= await allotTest(data);
     console.log(res,'test  is alloted')
      handleUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditFolder = async (id, newName) => {
    try {
      await editFolder({ folder_id: id, title: newName });
      handleUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFolder = (folder) => {
    setFolders((prev) => prev.filter((f) => f.id !== folder.id));
  };

  const handleAddTest = async (name, desc) => {
    try {
      await addExam({ title: name, description: desc });
      handleUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditTest = (id, newTitle) => {
    setUnassignedTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  const handleDeleteTest = (id) => {
    setUnassignedTests((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMoveToFolder = async (testId, folderId) => {
    try {
      await moveFolder({ exam_id: testId, folder_id: folderId });
      handleUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  // dropdown handlers
  const handleOpenMenu = (event, test) => {
    setAnchorEl(event.currentTarget);
    setSelectedTest(test);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTest(null);
  };

  const handleMoveTest = async (folderId) => {
    if (!selectedTest) return;
    await handleMoveToFolder(selectedTest.id, folderId);
    handleCloseMenu();
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
     {loading? (
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
        <CircularProgress size={60} thickness={4} sx={{ color: "blue" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "gray" }}>
          Loading Tests...
        </Typography>
      </Box>
    ):(<>
      <TestFoldersList
        folders={folders}
        onSelectFolder={(folder) => setCurrentFolder(folder)}
        onAddFolder={handleAddFolder}
        onEditFolder={handleEditFolder}
        onDeleteFolder={handleDeleteFolder}
        onAddTest={handleAddTest}
      />

      {!currentFolder && (
        <>
          <Typography sx={{ fontSize: "1.25rem", fontWeight: "bold", mb: 2 }}>
            Tests ({unassignedTests.length})
          </Typography>
          <Box sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: 1 }}>
            {unassignedTests.map((test) => (
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
                  <Typography sx={{ fontWeight: "bold" }}>
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
                  <Button
                    size="small"
                    sx={{ color: "green" }}
                    onClick={() =>
                      handleEditTest(
                        test.id,
                        prompt("Edit Test Name:", test.title) || test.title
                      )
                    }
                  >
                    Edit Name
                  </Button>
                  <Button
                    size="small"
                    sx={{ color: "green" }}
                    onClick={(e) => handleOpenMenu(e, test)}
                  >
                    Move to Folder
                  </Button>
                  <Button
                    size="small"
                    sx={{ color: "green" }}
                    onClick={() => handleDeleteTest(test.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Dropdown menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        {folders.map((folder) => (
          <MenuItem key={folder.id} onClick={() => handleMoveTest(folder.id)}>
            {folder.title}
          </MenuItem>
        ))}
      </Menu>
     </>)}

      <AllotTestModal
        open={openAllotModal}
        onClose={() => setOpenAllotModal(false)}
        onSubmit={handleAllotTest}
        selectedTest={selectedTest}
      />
    </Box>
  );
}
