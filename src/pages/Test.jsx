import React, { useState } from "react";
import TestFoldersList from "../components/TestFolder";
import TestCards from "../components/TestCards"; // New card style
import TestSections from "../components/Test";

export default function TestPage() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [viewingTest, setViewingTest] = useState(null);

  // Folder list data
  const foldersData = [
    { id: 1, name: "Cardiology Test" },
    { id: 2, name: "Neurology Test" },
    { id: 3, name: "Orthopedics Test" }
  ];

  // Updated Tests mapped to folder IDs — matches screenshot style
  const testsData = {
    1: [
      {
        id: 101,
        title: "General Knowledge",
        organization: "TechCryptors",
        status: "Attempted",
        startDate: "07/09/2025, 12:00 AM",
        endDate: "07/09/2025, 11:59 PM"
      },
      {
        id: 102,
        title: "Cardio Fitness",
        organization: "HeartCare Labs",
        status: "Upcoming",
        startDate: "10/09/2025, 10:00 AM",
        endDate: "10/09/2025, 2:00 PM"
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
    3: [
      {
        id: 301,
        title: "Bone Strength Check",
        organization: "OrthoPlus",
        status: "Completed",
        startDate: "01/08/2025, 9:00 AM",
        endDate: "01/08/2025, 10:00 AM"
      }
    ]
  };

  // If viewing a specific test's detailed sections
  if (viewingTest) {
    return (
      <TestSections
        testName={viewingTest.title}
        onBack={() => setViewingTest(null)}
      />
    );
  }

  // If a folder is selected, show its tests
  if (selectedFolder) {
    const folderTests = testsData[selectedFolder.id] || [];
    return (
      <div style={{ padding: 20 }}>
        <h2>{selectedFolder.name}</h2>
        <TestCards
          tests={folderTests}
          onViewStats={(test) => setViewingTest(test)}
          onDelete={(test) => alert(`Delete ${test.title}`)}
        />
        <button
          style={{ marginTop: 20 }}
          onClick={() => setSelectedFolder(null)}
        >
          Back to Folders
        </button>
      </div>
    );
  }

  // Default view: folder list
  return (
    <TestFoldersList
      folders={foldersData}
      onSelectFolder={(folder) => setSelectedFolder(folder)}
      onEditFolder={(folder) => alert(`Edit ${folder.name}`)}
      onDeleteFolder={(folder) => alert(`Delete ${folder.name}`)}
    />
  );
}
