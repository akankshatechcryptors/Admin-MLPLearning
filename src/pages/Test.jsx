import React, { useState } from "react";
import TestFoldersList from "../components/TestFolder";
import Breadcrumbs from "../components/BreadCrumb";
import { Box, Typography, Button } from "@mui/material";
import AllotTestModal from "../components/AllotTest";

// Inside TestCards component state

export default function TestPage() {
  const [viewingTest, setViewingTest] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
const [openAllotModal, setOpenAllotModal] = useState(false);
  // Folders state
  const [folders, setFolders] = useState([
    { id: 1, name: "Cardiology Test" },
    { id: 2, name: "Neurology Test" },
    { id: 3, name: "Orthopedics Test" }
  ]);

  // Unassigned tests state
  const [unassignedTests, setUnassignedTests] = useState([
    { id: 1001, title: "First Test", status: "Alloted" },
    { id: 1002, title: "General Knowledge 2", status: "Alloted" },
    { id: 1003, title: "test-11/7", status: "Not Allotted" },
    { id: 1004, title: "test-11/8", status: "Not Allotted" }
  ]);

  // Tests inside folders
  const [testsData, setTestsData] = useState({
    1: [
      {
        id: 101,
        title: "General Knowledge",
        organization: "TechCryptors",
        status: "Attempted",
        startDate: "07/09/2025, 12:00 AM",
        endDate: "07/09/2025, 11:59 PM"
      }
    ],
    2: [
      {
        id: 201,
        title: "Brain Reflex Test",
        organization: "NeuroMind Clinic",
        status: "Attempted",
        startDate: "05/09/2025, 1:00 PM",
        endDate: "05/09/2025, 3:00 PM"
      }
    ],
    3: []
  });

  // ====== Folder Handlers ======
  const handleAddFolder = (name) => {
    const newFolder = { id: Date.now(), name };
    setFolders((prev) => [...prev, newFolder]);
    setTestsData((prev) => ({ ...prev, [newFolder.id]: [] }));
  };

  const handleEditFolder = (id, newName) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName } : f))
    );
  };

  const handleDeleteFolder = (folder) => {
    setFolders((prev) => prev.filter((f) => f.id !== folder.id));
    setTestsData((prev) => {
      const copy = { ...prev };
      delete copy[folder.id];
      return copy;
    });
  };

  // ====== Test Handlers ======
  const handleAddTest = (name) => {
    const newTest = { id: Date.now(), title: name, status: "Not Allotted" };
    setUnassignedTests((prev) => [...prev, newTest]);
  };

  const handleEditTest = (id, newTitle) => {
    setUnassignedTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  const handleDeleteTest = (id) => {
    setUnassignedTests((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMoveToFolder = (testId, folderId) => {
    const test = unassignedTests.find((t) => t.id === testId);
    if (!test) return;

    // Remove from unassigned
    setUnassignedTests((prev) => prev.filter((t) => t.id !== testId));

    // Add to folder
    setTestsData((prev) => ({
      ...prev,
      [folderId]: [...(prev[folderId] || []), test]
    }));
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen" >
      {/* Folders List */}
      <TestFoldersList
        folders={folders}
        onSelectFolder={(folder) => setCurrentFolder(folder)}
        onAddFolder={handleAddFolder}
        onEditFolder={handleEditFolder}
        onDeleteFolder={handleDeleteFolder}
        onAddTest={handleAddTest}
      />

      {/* Unassigned Tests */}
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
                  mb: 1
                }}
              >
                {/* Test Title + Status */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontWeight: "bold" }}>
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
                        fontSize: "0.8rem"
                      }}
                    >
                      Alloted
                    </Box>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    sx={{ color: "green" }}
                     onClick={() => setOpenAllotModal(true)}
                  >
                    Allot Test
                  </Button>
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
                    onClick={() =>
                      handleMoveToFolder(test.id, folders[0]?.id || null)
                    }
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
      <AllotTestModal
  open={openAllotModal}
  onClose={() => setOpenAllotModal(false)}
  onSubmit={(data) => {
    console.log("Allot Test Data:", data);
    // call your API here
  }}
/>
    </Box>
  );
}
