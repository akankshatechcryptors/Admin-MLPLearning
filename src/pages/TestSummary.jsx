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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function TestResultsUI() {
  const [open, setOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const tests = [
    {
      id: 1,
      name: "General Knowledge - TechCryptors",
      status: "Attempted",
      dateStart: "07/09/2025, 12:00 AM",
      dateEnd: "07/09/2025, 11:59 PM",
      stats: {
        maxMarks: 5,
        avgScore: 0,
        avgGrade: "F",
        appeared: 0,
        totalStudents: 5,
        avgTime: "0 Hours",
        grades: [
          { label: "A Grade", color: "#2196f3" },
          { label: "B Grade", color: "#4caf50" },
          { label: "C Grade", color: "#ffeb3b" },
          { label: "D Grade", color: "#ffeb3b" },
          { label: "E Grade", color: "#ff9800" },
          { label: "F Grade", color: "#f44336" },
        ],
        students: [
          { name: "Manish Hemant Dave", marks: "-", grade: "Absent" },
          { name: "Josh Sharlton Dsouza", marks: "-", grade: "Absent" },
          { name: "Mayur Ashish Thakur", marks: "-", grade: "Absent" },
        ],
      },
    },
  ];

  const handleOpenStats = (test) => {
    setSelectedTest(test);
    setOpen(true);
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Tests({tests.length})
      </Typography>

      {tests.map((test) => (
        <Box
          key={test.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#e6f4e6",
            borderRadius: 2,
            p: 1.5,
            mb: 1,
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
            <Typography variant="body2">
              {test.dateStart} - {test.dateEnd}
            </Typography>
            <Button size="small" onClick={() => handleOpenStats(test)}>
              View Stats
            </Button>
            <Button size="small" color="error">
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
          {/* Grade Legend + Stats */}
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
          <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
            <Paper sx={{ p: 2, bgcolor: "#ffeb3b" }}>
              Maximum marks {selectedTest?.stats.maxMarks}
            </Paper>
            <Paper sx={{ p: 2, bgcolor: "#ffcc80" }}>
              Average Score {selectedTest?.stats.avgScore} /{" "}
              {selectedTest?.stats.maxMarks}
            </Paper>
            <Paper sx={{ p: 2, bgcolor: "#b3e5fc" }}>
              Average Grade {selectedTest?.stats.avgGrade}
            </Paper>
            <Paper sx={{ p: 2, bgcolor: "#f8bbd0" }}>
              Appeared Students {selectedTest?.stats.appeared} /{" "}
              {selectedTest?.stats.totalStudents}
            </Paper>
            <Paper sx={{ p: 2, bgcolor: "#fff9c4" }}>
              Average Time Taken {selectedTest?.stats.avgTime}
            </Paper>
          </Box>

          {/* Students Table */}
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#e6f4e6" }}>
                <TableRow>
                  <TableCell>NAME</TableCell>
                  <TableCell>MARKS</TableCell>
                  <TableCell>GRADE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTest?.stats.students.map((student, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.marks}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
