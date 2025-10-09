import React, { useState ,useEffect} from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import TestSummary from "../components/TestSummary";
import GroupSummary from "../components/GroupSummary";
import UserSummary from "../components/UserSummary";
import { testSummary } from "../common/api";
import Breadcrumb from '../components/BreadCrumb'
import Loading from '../components/Loading'
// ✅ Updated sample data
import { format } from "date-fns";
const sampleData = [
  {
    id: 201,
    name: "Doctors Final Exam - Batch A",
    status: "Active",
    startDate: "2025-09-01",
    endDate: "2025-09-30",
    minTime: "40 min",
    avgTime: "42 min",
    minMarks: 40, // overall test-level minimum marks
    modules: [
      { id: "M1", name: "Blood Disorders", maxMarks: 10, media: { type: "video", url: "https://example.com/video/pathology1.mp4" } },
      { id: "M2", name: "Histopathology", maxMarks: 10, media: { type: "pdf", url: "https://example.com/pdf/pathology2.pdf" } },
      { id: "M3", name: "Cytology", maxMarks: 10, media: { type: "video", url: "https://example.com/video/pathology3.mp4" } },
      { id: "M4", name: "Infectious Disease", maxMarks: 10, media: { type: "pdf", url: "https://example.com/pdf/pathology4.pdf" } },
      { id: "M5", name: "Clinical Pathology", maxMarks: 10, media: { type: "video", url: "https://example.com/video/pathology5.mp4" } },
    ],
    groups: [
      {
        groupName: "Pathology",
        users: [
          { id: "P1", name: "Dr. Aisha Khan", obtained: { M1: 8, M2: 7, M3: 9, M4: 6, M5: 8 } },
          { id: "P2", name: "Dr. Ravi Sharma", obtained: { M1: 0, M2: 0, M3: 0, M4: 0, M5: 0 } }, // Pending
          { id: "P3", name: "Dr. Maria Lopez", obtained: { M1: 7, M2: 8, M3: 6, M4: 9, M5: 5 } },
          { id: "P4", name: "Dr. Emily Zhang", obtained: { M1: 2, M2: 3, M3: 2, M4: 1, M5: 3 } },
        ],
      },
      {
        groupName: "Neurology",
        users: [
          { id: "N1", name: "Dr. James Wilson", obtained: { M1: 9, M2: 8, M3: 7, M4: 8, M5: 9 } },
          { id: "N2", name: "Dr. Sara Lee", obtained: { M1: 3, M2: 2, M3: 1, M4: 2, M5: 3 } },
        ],
      },
    ],
  },
  {
    id: 202,
    name: "Mid-Year Assessment - Batch B",
    status: "Completed",
    startDate: "2025-06-01",
    endDate: "2025-06-15",
    minTime: "30 min",
    avgTime: "35 min",
    minMarks: 35,
    modules: [
      { id: "M1", name: "Bone Fractures", maxMarks: 10, media: { type: "video", url: "https://example.com/video/ortho1.mp4" } },
      { id: "M2", name: "Joint Replacement", maxMarks: 10, media: { type: "pdf", url: "https://example.com/pdf/ortho2.pdf" } },
      { id: "M3", name: "Sports Injuries", maxMarks: 10, media: { type: "video", url: "https://example.com/video/ortho3.mp4" } },
      { id: "M4", name: "Spinal Surgery", maxMarks: 10, media: { type: "pdf", url: "https://example.com/pdf/ortho4.pdf" } },
      { id: "M5", name: "Orthopedic Oncology", maxMarks: 10, media: { type: "video", url: "https://example.com/video/ortho5.mp4" } },
    ],
    groups: [
      {
        groupName: "Orthopedics",
        users: [
          { id: "O1", name: "Dr. Michael Brown", obtained: { M1: 9, M2: 8, M3: 7, M4: 9, M5: 8 } },
          { id: "O2", name: "Dr. Grace Patel", obtained: { M1: 3, M2: 4, M3: 2, M4: 3, M5: 4 } },
        ],
      },
    ],
  },
];

// Helpers
const getCardColor = (status) => {
  return "#FFF"; // fallback white
};

const getTotalUsers = (test) => {
  return test.groups.reduce((count, group) => count + group.users.length, 0);
};
const formatDate = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const TestResultsDashboard = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [data,setData]=useState(null)
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(()=>{
const getSumData=async()=>{
const res=await testSummary()
setData(res.data)
}
getSumData()
  },[])
const onClose=()=>{
  setSelectedGroup(null)
  setSelectedTest(null)
  setSelectedUser(null)
}


if (!data) return <Loading message={'Loading Summary data'}/>
const filteredTests = data?.exams?.filter((test) =>
  test.title.toLowerCase().includes(searchTerm.toLowerCase())
) || [];
  return (
    <Box p={{ xs: 2, md: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Breadcrumb/>
        <Box display="flex" gap={1}>
          
          <Typography variant="h5" fontWeight="bold">
          Test Summary
        </Typography>
        </Box>
        <div></div>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item size={{xs:12 ,sm:12}}>
            <TextField
              fullWidth
              placeholder="Search tests, e.g. 'Final' or 'Batch'"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
         
        </Grid>
      </Card>

      {/* Test Cards */}
      <Grid container spacing={3}>
        {filteredTests.map((test) => (
          <Grid item size={{xs:12, sm:3,md:4,lg:4}} key={test.id}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: getCardColor(test.status),
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Typography variant="h6" fontWeight="bold">
                  {test.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: test.status === "Active" ? "#FBC02D" : "#388E3C",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {test.status}
                </Typography>
              </Box>

              {/* Dates + Test Info */}
              <Typography variant="body2" color="text.secondary">
                •{format(new Date(test.start_date), "dd MMM yyyy")} → {format(new Date(test.end_date), "dd MMM yyyy")}<br/>•
                Min Marks: {test.min_marks} <br/>• Total Users: {getTotalUsers(test)}
              </Typography>

              <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedTest(test)}
                >
                  View
                </Button>
               
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog */}
      <Dialog
        open={!!selectedTest}
        onClose={() => setSelectedTest(null)}
        fullWidth
        maxWidth="xl"
        fullScreen={isSm}
      >
        <DialogTitle>
          {selectedTest?.title} — Summary ({selectedTest?.status})
        </DialogTitle>
        <DialogContent dividers>
          {selectedTest && !selectedGroup && (
            <TestSummary test={selectedTest} onGroupSelect={setSelectedGroup} />
          )}
          {selectedGroup && !selectedUser && (
            <GroupSummary
              group={selectedGroup}
              test={selectedTest}
              onUserSelect={setSelectedUser}
              onBack={() => setSelectedGroup(null)}
            />
          )}
          {selectedUser && (
            <UserSummary
              user={selectedUser}
              test={selectedTest}
              onBack={() => setSelectedUser(null)}
            />
          )}
        </DialogContent>
        <DialogActions>
          {selectedUser && <Button onClick={() => setSelectedUser(null)}>Back to Group</Button>}
          {selectedGroup && !selectedUser && <Button onClick={() => setSelectedGroup(null)}>Back to Test</Button>}
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestResultsDashboard;
