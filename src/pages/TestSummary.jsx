import React, { useMemo, useState } from "react";
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
  Stack,
  useMediaQuery,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

import Breadcrumbs from "../components/BreadCrumb";

// Pastel palette utility
const PASTEL = [
  "#AEC6CF",
  "#FFD1DC",
  "#FDFD96",
  "#C3FDB8",
  "#B39EB5",
  "#FFB347",
  "#B5EAEA",
];

export default function TestResultsUIEnhanced() {
  const [open, setOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const isSm = useMediaQuery("(max-width:900px)");

  // Sample data — expand as needed. Each module now contains detailed stats.
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
          { label: "A Grade", count: 3 },
          { label: "B Grade", count: 6 },
          { label: "C Grade", count: 4 },
          { label: "D Grade", count: 1 },
          { label: "F Grade", count: 1 },
        ],
        moduleScores: [
          {
            module: "Cardiology",
            avgScore: 18,
            outOf: 20,
            passed: 12,
            attempted: 15,
            assigned: 20,
          },
          {
            module: "Neurology",
            avgScore: 15,
            outOf: 20,
            passed: 10,
            attempted: 14,
            assigned: 20,
          },
          {
            module: "Pulmonology",
            avgScore: 16,
            outOf: 20,
            passed: 11,
            attempted: 15,
            assigned: 20,
          },
          {
            module: "Endocrinology",
            avgScore: 14,
            outOf: 20,
            passed: 9,
            attempted: 13,
            assigned: 20,
          },
          {
            module: "Nephrology",
            avgScore: 15,
            outOf: 20,
            passed: 10,
            attempted: 15,
            assigned: 20,
          },
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
          { label: "A Grade", count: 2 },
          { label: "B Grade", count: 8 },
          { label: "C Grade", count: 6 },
          { label: "D Grade", count: 1 },
          { label: "F Grade", count: 1 },
        ],
        moduleScores: [
          {
            module: "General Surgery",
            avgScore: 14,
            outOf: 16,
            passed: 11,
            attempted: 18,
            assigned: 20,
          },
          {
            module: "Orthopedic Surgery",
            avgScore: 12,
            outOf: 16,
            passed: 10,
            attempted: 17,
            assigned: 20,
          },
          {
            module: "Neurosurgery",
            avgScore: 10,
            outOf: 16,
            passed: 8,
            attempted: 15,
            assigned: 20,
          },
          {
            module: "Plastic Surgery",
            avgScore: 13,
            outOf: 16,
            passed: 12,
            attempted: 16,
            assigned: 20,
          },
          {
            module: "Pediatric Surgery",
            avgScore: 13,
            outOf: 16,
            passed: 12,
            attempted: 16,
            assigned: 20,
          },
        ],
      },
    },
  ];

  const handleOpenStats = (test) => {
    setSelectedTest(test);
    setOpen(true);
  };

  // derived values
  const derived = useMemo(() => {
    if (!selectedTest) return null;

    const modules = selectedTest.stats.moduleScores;
    const totalAssigned = modules.reduce((s, m) => s + (m.assigned || 0), 0);
    const totalAttempted = modules.reduce((s, m) => s + (m.attempted || 0), 0);
    const totalPassed = modules.reduce((s, m) => s + (m.passed || 0), 0);

    // module average percentage
    const moduleAvgPct = modules.map((m) => {
      const pct = m.outOf ? (m.avgScore / m.outOf) * 100 : 0;
      return { module: m.module, pct: Math.round(pct * 10) / 10 };
    });

    return { modules, totalAssigned, totalAttempted, totalPassed, moduleAvgPct };
  }, [selectedTest]);

  // Charts data builders
  const buildModuleAvgChart = () => {
    if (!derived) return { labels: [], datasets: [] };
    return {
      labels: derived.modules.map((m) => m.module),
      datasets: [
        {
          label: "Average Score (pct)",
          data: derived.moduleAvgPct.map((m) => m.pct),
          backgroundColor: PASTEL.slice(0, derived.modules.length),
          borderRadius: 6,
        },
      ],
    };
  };

  const buildPassRatePie = () => {
    if (!derived) return { labels: [], datasets: [] };
    const passCounts = derived.modules.map((m) => m.passed);
    const failCounts = derived.modules.map((m) => (m.attempted || 0) - (m.passed || 0));

    // We'll show overall pass vs fail
    const totalPassed = derived.totalPassed;
    const totalAttempted = derived.totalAttempted;
    const totalFailed = Math.max(totalAttempted - totalPassed, 0);

    return {
      labels: ["Passed (all modules)", "Failed (all modules)"],
      datasets: [
        {
          data: [totalPassed, totalFailed],
          backgroundColor: ["#C3FDB8", "#FFD1DC"],
        },
      ],
    };
  };

  const buildAttemptAssignedChart = () => {
    if (!derived) return { labels: [], datasets: [] };
    return {
      labels: derived.modules.map((m) => m.module),
      datasets: [
        {
          label: "Assigned",
          data: derived.modules.map((m) => m.assigned || 0),
          backgroundColor: PASTEL.slice(0, derived.modules.length).map((c) => c + "55"),
        },
        {
          label: "Attempted",
          data: derived.modules.map((m) => m.attempted || 0),
          backgroundColor: PASTEL.slice(0, derived.modules.length),
        },
      ],
    };
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Box className="flex justify-between items-center mb-4 gap-4">
        <Breadcrumbs />
        <Typography variant="h5" fontWeight="700">
          Tests ({tests.length})
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" size="small">
            Export CSV
          </Button>
          <Button variant="contained" size="small">
            Refresh
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {tests.map((test) => (
          <Grid item xs={12} md={6} key={test.id}>
            <Paper sx={{ p: 2, borderRadius: 2 }} elevation={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography fontWeight={700}>{test.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {test.dateStart} — {test.dateEnd}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={test.status} color="default" sx={{ bgcolor: "#FFF2D6", fontWeight: 700 }} />
                  <Button size="small" variant="contained" onClick={() => handleOpenStats(test)}>
                    View Stats
                  </Button>
                  <Button size="small" color="error" variant="outlined">
                    Delete
                  </Button>
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={1}>
                <Grid item xs={6} sm={4}>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="caption">Avg Score</Typography>
                    <Typography fontWeight={700}>{test.stats.avgScore} / {test.stats.maxMarks}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="caption">Appeared</Typography>
                    <Typography fontWeight={700}>{test.stats.appeared} / {test.stats.totalStudents}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="caption">Avg Time</Typography>
                    <Typography fontWeight={700}>{test.stats.avgTime}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Stats Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Test Result — {selectedTest?.name}</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* top summary */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="caption">Total Modules</Typography>
                <Typography fontWeight={700}>{selectedTest?.stats.moduleScores.length || 0}</Typography>

                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>Total Assigned (sum)</Typography>
                <Typography fontWeight={700}>{derived?.totalAssigned ?? 0}</Typography>

                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>Total Attempted (sum)</Typography>
                <Typography fontWeight={700}>{derived?.totalAttempted ?? 0}</Typography>

                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>Total Passed (sum)</Typography>
                <Typography fontWeight={700}>{derived?.totalPassed ?? 0}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={9}>
              <Grid container spacing={1}>
                {selectedTest?.stats.moduleScores.map((m, i) => (
                  <Grid item xs={12} sm={6} md={4} key={m.module}>
                    <Paper sx={{ p: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700}>{m.module}</Typography>
                      <Typography variant="caption">Avg: {m.avgScore}/{m.outOf}</Typography>
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography variant="body2">Passed: {m.passed}</Typography>
                        <Typography variant="body2">Attempted: {m.attempted}</Typography>
                      </Box>
                      <Box mt={1} sx={{ height: 8, bgcolor: "#f0f0f0", borderRadius: 2 }}>
                        <Box sx={{ width: `${Math.round((m.avgScore / m.outOf) * 100)}%`, height: 8, bgcolor: PASTEL[i % PASTEL.length], borderRadius: 2 }} />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} mb={1}>Module-wise Average (%)</Typography>
                <Bar data={buildModuleAvgChart()} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} height={isSm ? 220 : 300} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} mb={1}>Pass vs Fail (overall)</Typography>
                <Pie data={buildPassRatePie()} options={{ responsive: true, maintainAspectRatio: false }} height={isSm ? 180 : 240} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} mb={1}>Assigned vs Attempted (per module)</Typography>
                <Bar data={buildAttemptAssignedChart()} options={{ responsive: true, indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} height={isSm ? 220 : 300} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} mb={1}>Grade Distribution</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedTest?.stats.grades.map((g, idx) => (
                    <Paper key={idx} sx={{ p: 1, minWidth: 140 }}>
                      <Typography variant="caption">{g.label}</Typography>
                      <Typography fontWeight={700}>{g.count ?? 0} students</Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
