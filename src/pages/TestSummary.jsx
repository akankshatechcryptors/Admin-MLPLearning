import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
import Breadcrumbs from "../components/BreadCrumb";
export default function TestResultsUI() {
  const [open, setOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

const tests = [
  {
    id: 1,
    name: "General Medicine - TechCryptors",
    status: "Attempted",
    dateStart: "07/09/2025, 12:00 AM",
    dateEnd: "07/09/2025, 11:59 PM",
    stats: {
      maxMarks: 100,
      avgScore: 78,
      avgGrade: "B+",
      appeared: 15,
      totalStudents: 20,
      avgTime: "1 Hour 20 Minutes",
      grades: [
        { label: "A Grade", color: "#2196f3" },
        { label: "B Grade", color: "#4caf50" },
        { label: "C Grade", color: "#ffeb3b" },
        { label: "D Grade", color: "#ff9800" },
        { label: "F Grade", color: "#f44336" },
      ],
      moduleScores: [
        { module: "Cardiology", score: 18 },
        { module: "Neurology", score: 15 },
        { module: "Pulmonology", score: 16 },
        { module: "Endocrinology", score: 14 },
        { module: "Nephrology", score: 15 },
      ],
    },
  },
  {
    id: 2,
    name: "Surgery Assessment - TechCryptors",
    status: "Attempted",
    dateStart: "08/09/2025, 9:00 AM",
    dateEnd: "08/09/2025, 6:00 PM",
    stats: {
      maxMarks: 80,
      avgScore: 62,
      avgGrade: "B",
      appeared: 18,
      totalStudents: 20,
      avgTime: "1 Hour 5 Minutes",
      grades: [
        { label: "A Grade", color: "#2196f3" },
        { label: "B Grade", color: "#4caf50" },
        { label: "C Grade", color: "#ffeb3b" },
        { label: "D Grade", color: "#ff9800" },
        { label: "F Grade", color: "#f44336" },
      ],
      moduleScores: [
        { module: "General Surgery", score: 14 },
        { module: "Orthopedic Surgery", score: 12 },
        { module: "Neurosurgery", score: 10 },
        { module: "Plastic Surgery", score: 13 },
        { module: "Pediatric Surgery", score: 13 },
      ],
    },
  },
  {
    id: 3,
    name: "Pediatrics Examination ",
    status: "Attempted",
    dateStart: "09/09/2025, 10:00 AM",
    dateEnd: "09/09/2025, 4:00 PM",
    stats: {
      maxMarks: 90,
      avgScore: 75,
      avgGrade: "A-",
      appeared: 19,
      totalStudents: 20,
      avgTime: "1 Hour 15 Minutes",
      grades: [
        { label: "A Grade", color: "#2196f3" },
        { label: "B Grade", color: "#4caf50" },
        { label: "C Grade", color: "#ffeb3b" },
        { label: "D Grade", color: "#ff9800" },
        { label: "F Grade", color: "#f44336" },
      ],
      moduleScores: [
        { module: "Neonatology", score: 16 },
        { module: "Pediatric Cardiology", score: 15 },
        { module: "Pediatric Neurology", score: 14 },
        { module: "Pediatric Infectious Diseases", score: 15 },
        { module: "Pediatric Endocrinology", score: 15 },
      ],
    },
  },
];

  const handleOpenStats = (test) => {
    setSelectedTest(test);
    setOpen(true);
  };

  const getModuleChartData = () => {
    if (!selectedTest) return {};
    return {
      labels: selectedTest.stats.moduleScores.map((m) => m.module),
      datasets: [
        {
          label: "Module Score",
          data: selectedTest.stats.moduleScores.map((m) => m.score),
          backgroundColor: [
            "#2196f3",
            "#4caf50",
            "#ffeb3b",
            "#ff9800",
            "#f44336",
          ],
          borderRadius: 8,
        },
      ],
    };
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
     <Box className="flex justify-between">
       <Breadcrumbs/>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Tests ({tests.length})
      </Typography>
      <div>
        
      </div>
     </Box>

      {tests.map((test) => (
        <Box
          key={test.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 2,
            p: 1.5,
            mb: 1,
            boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <Box>
            <Typography fontWeight="bold">{test.name}</Typography>
            <Chip
              label={test.status}
              sx={{ bgcolor: "#ffeb3b", fontWeight: "bold" }}
              size="small"
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {test.dateStart} - {test.dateEnd}
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={() => handleOpenStats(test)}
            >
              View Stats
            </Button>
            <Button size="small" color="error" variant="outlined">
              Delete Test
            </Button>
          </Box>
        </Box>
      ))}

      {/* Stats Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">
            Test Result - {selectedTest?.name}
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Grade Legend */}
          <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
            {selectedTest?.stats.grades.map((g, i) => (
              <Box key={i} display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: g.color,
                    borderRadius: "4px",
                  }}
                />
                <Typography variant="body2">{g.label}</Typography>
              </Box>
            ))}
          </Box>

          {/* Stats Boxes */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, bgcolor: "#e3f2fd", fontWeight: "bold" }}>
                Max Marks: {selectedTest?.stats.maxMarks}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, bgcolor: "#fff9c4", fontWeight: "bold" }}>
                Avg Score: {selectedTest?.stats.avgScore} /{" "}
                {selectedTest?.stats.maxMarks}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, bgcolor: "#fce4ec", fontWeight: "bold" }}>
                Appeared: {selectedTest?.stats.appeared} /{" "}
                {selectedTest?.stats.totalStudents}
              </Paper>
            </Grid>
          </Grid>

          {/* Module-wise Bar Chart */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Module-wise Performance
            </Typography>
            <Bar data={getModuleChartData()} options={{ responsive: true }} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
