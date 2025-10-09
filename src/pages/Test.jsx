import React, { useEffect, useState } from "react";
import TestFoldersList from "../components/TestFolder";
import Breadcrumbs from "../components/BreadCrumb";
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import {useNavigate} from 'react-router-dom'
import AllotTestModal from "../components/AllotTest";
import {
  getFolder,
  addFolder,
  editFolder,
  editExam,
  addExam,
  getExam,
  moveFolder,
  allotTest
} from "../common/api";
import Loading from '../components/Loading'
export default function TestPage() {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [openAllotModal, setOpenAllotModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [folders, setFolders] = useState([]);
  const [unassignedTests, setUnassignedTests] = useState([]);
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate();
  // dropdown state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const handleUpdate = () => setUpdate(!update);
  const today = new Date().toISOString().split("T")[0];
  const getFolders = async () => {
    setLoading(true)
    try {
      const res = await getFolder();
      setFolders(res.data.folders);
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };

  const getExams = async () => {
    setLoading(true)
    const data = { folder_id: "", group_id: "" };
    try {
      const res = await getExam(data);
      //console.log(res)
      setUnassignedTests(res.data.groups);
      setLoading(false)
    } catch (error) {
      console.error(error);
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
      console.error(error);
    }
  };
 const handleAllotTest = async (data) => {
    try {
     const res= await allotTest(data);
     handleUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditFolder = async (id, newName) => {
    try {
      await editFolder({ folder_id: id, title: newName });
      handleUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFolder = (folder) => {
    setFolders((prev) => prev.filter((f) => f.id !== folder.id));
  };

  const handleAddTest = async (name, desc) => {
    try {
      const res=await addExam({ title: name, description: desc });
      console.log(res)
      handleUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const [openEditTestModal, setOpenEditTestModal] = useState(false);
const [editingTest, setEditingTest] = useState(null);

const handleEditTest = async (id, newTitle, newDesc) => {
  try {
    await editExam({ id, title: newTitle, description: newDesc, update: true });
    // or make a separate editExam API if you have
    handleUpdate();
  } catch (error) {
    console.error(error);
  }
};


  const handleDeleteTest = (id) => {
    setUnassignedTests((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMoveToFolder = async (testId, folderId) => {
    try {
      await moveFolder({ exam_id: testId, folder_id: folderId });
      handleUpdate();
    } catch (error) {
      console.error(error);
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
        <Loading message={"Loading Tests"}/>
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
                  <Typography sx={{ fontWeight: "bold" }} 
                  onClick={() =>
                    navigate("/add-questions", 
                      { state: { testName: test.title, 
                        instructions: test.description 
                        ,id:test.id,
                        startDate:test.start_date }})
                  }>
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
                    onClick={() => {
    setEditingTest(test);
    setOpenEditTestModal(true);
  }}
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
                  {/* <Button
                    size="small"
                    sx={{ color: "green" }}
                    onClick={() => handleDeleteTest(test.id)}
                  >
                    Delete
                  </Button> */}
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
<Dialog open={openEditTestModal} onClose={() => setOpenEditTestModal(false)}>
  <DialogTitle>Edit Test</DialogTitle>
  <DialogContent>
    <TextField
      margin="dense"
      label="Test Name"
      fullWidth
      value={editingTest?.title || ""}
      onChange={(e) =>
        setEditingTest({ ...editingTest, title: e.target.value })
      }
    />
    <TextField
      margin="dense"
      label="Instructions"
      fullWidth
      value={editingTest?.description || ""}
      onChange={(e) =>
        setEditingTest({ ...editingTest, description: e.target.value })
      }
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenEditTestModal(false)}>Cancel</Button>
    <Button
      variant="contained"
      onClick={() => {
        handleEditTest(editingTest.id, editingTest.title, editingTest.description);
        setOpenEditTestModal(false);
      }}
    >
      Save
    </Button>
  </DialogActions>
</Dialog>

      <AllotTestModal
        open={openAllotModal}
        onClose={() => setOpenAllotModal(false)}
        onSubmit={handleAllotTest}
        selectedTest={selectedTest}
      />
    </Box>
  );
}
