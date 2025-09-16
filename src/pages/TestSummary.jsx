// src/components/TestResultsDashboard.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  MenuItem,
  Select,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
  useMediaQuery,
  LinearProgress,
  Tooltip,
  TableContainer,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import BarChartIcon from "@mui/icons-material/BarChart";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { jsPDF } from "jspdf";

/* ---------------- Sample data (same as you provided) ---------------- */
const sampleData = [
  {
    id: 1,
    name: "Doctors Final Exam – Batch A",
    date: "2025-09-01",
    status: "Active",
    maxMarks: 100,
    minMarks: 40,
    avgTime: "42m",
    groups: [
      {
        groupName: "Doctors",
        summary: { avgScore: 65, appeared: 25, total: 30 },
        users: [
          {
            id: "U101",
            name: "Dr. Aditi Sharma",
            email: "aditi@example.com",
            totalScore: 72,
            status: "Pass",
            timeTaken: "40m",
            sections: [
              {
                name: "Anatomy",
                minMarks: 12,
                maxMarks: 30,
                obtained: 22,
                questions: [
                  { qid: 1, text: "Bones of skull", maxMarks: 5, obtained: 4 },
                  { qid: 2, text: "Muscles of arm", maxMarks: 5, obtained: 3 },
                  { qid: 3, text: "Heart anatomy", maxMarks: 10, obtained: 8 },
                  { qid: 4, text: "Liver lobes", maxMarks: 10, obtained: 7 },
                ],
              },
              {
                name: "Physiology",
                minMarks: 10,
                maxMarks: 30,
                obtained: 20,
                questions: [
                  { qid: 1, text: "Kidney function", maxMarks: 10, obtained: 7 },
                  { qid: 2, text: "Hormones", maxMarks: 10, obtained: 6 },
                  { qid: 3, text: "ECG basics", maxMarks: 10, obtained: 7 },
                ],
              },
              {
                name: "Pharmacology",
                minMarks: 8,
                maxMarks: 40,
                obtained: 30,
                questions: [
                  { qid: 1, text: "Antibiotics", maxMarks: 10, obtained: 9 },
                  { qid: 2, text: "Analgesics", maxMarks: 10, obtained: 7 },
                  { qid: 3, text: "Anesthetics", maxMarks: 10, obtained: 7 },
                  { qid: 4, text: "Antivirals", maxMarks: 10, obtained: 7 },
                ],
              },
            ],
          },
          {
            id: "U102",
            name: "Dr. Rohan Mehta",
            email: "rohan@example.com",
            totalScore: 55,
            status: "Pass",
            timeTaken: "44m",
            sections: [
              {
                name: "Anatomy",
                minMarks: 12,
                maxMarks: 30,
                obtained: 18,
                questions: [
                  { qid: 1, text: "Bones of skull", maxMarks: 5, obtained: 4 },
                  { qid: 2, text: "Muscles of arm", maxMarks: 5, obtained: 2 },
                  { qid: 3, text: "Heart anatomy", maxMarks: 10, obtained: 7 },
                  { qid: 4, text: "Liver lobes", maxMarks: 10, obtained: 5 },
                ],
              },
              {
                name: "Physiology",
                minMarks: 10,
                maxMarks: 30,
                obtained: 15,
                questions: [
                  { qid: 1, text: "Kidney function", maxMarks: 10, obtained: 5 },
                  { qid: 2, text: "Hormones", maxMarks: 10, obtained: 5 },
                  { qid: 3, text: "ECG basics", maxMarks: 10, obtained: 5 },
                ],
              },
              {
                name: "Pharmacology",
                minMarks: 8,
                maxMarks: 40,
                obtained: 22,
                questions: [
                  { qid: 1, text: "Antibiotics", maxMarks: 10, obtained: 6 },
                  { qid: 2, text: "Analgesics", maxMarks: 10, obtained: 5 },
                  { qid: 3, text: "Anesthetics", maxMarks: 10, obtained: 6 },
                  { qid: 4, text: "Antivirals", maxMarks: 10, obtained: 5 },
                ],
              },
            ],
          },
        ],
      },
      {
        groupName: "Observers",
        summary: { avgScore: 45, appeared: 0, total: 0 },
        users: [],
      },
    ],
  },

  {
    id: 2,
    name: "Doctors Midterm – Surgery & Medicine",
    date: "2025-08-15",
    status: "Completed",
    maxMarks: 100,
    minMarks: 35,
    avgTime: "55m",
    groups: [
      {
        groupName: "Doctors",
        summary: { avgScore: 72, appeared: 40, total: 42 },
        users: [
          {
            id: "U201",
            name: "Dr. Mukesh Patel",
            email: "mukesh@example.com",
            totalScore: 78,
            status: "Pass",
            timeTaken: "50m",
            sections: [
              {
                name: "General Surgery",
                minMarks: 12,
                maxMarks: 40,
                obtained: 30,
                questions: [
                  { qid: 1, text: "Wound care", maxMarks: 10, obtained: 8 },
                  { qid: 2, text: "Fracture mgmt", maxMarks: 10, obtained: 7 },
                  { qid: 3, text: "Suturing", maxMarks: 10, obtained: 8 },
                  { qid: 4, text: "Pre-op", maxMarks: 10, obtained: 7 },
                ],
              },
              {
                name: "Internal Medicine",
                minMarks: 10,
                maxMarks: 30,
                obtained: 28,
                questions: [
                  { qid: 1, text: "Diabetes", maxMarks: 10, obtained: 9 },
                  { qid: 2, text: "HTN", maxMarks: 10, obtained: 10 },
                  { qid: 3, text: "Infectious disease", maxMarks: 10, obtained: 9 },
                ],
              },
              {
                name: "Pediatrics",
                minMarks: 8,
                maxMarks: 30,
                obtained: 20,
                questions: [
                  { qid: 1, text: "Neonatal care", maxMarks: 10, obtained: 7 },
                  { qid: 2, text: "Growth charts", maxMarks: 10, obtained: 6 },
                  { qid: 3, text: "Vaccine schedule", maxMarks: 10, obtained: 7 },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const COLORS = ["#1976d2", "#4caf50", "#ff9800", "#9c27b0", "#f44336"];

/* ---------------- Component ---------------- */
export default function TestResultsDashboard() {
  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [groupFilter, setGroupFilter] = useState("All");
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openQuestionsFor, setOpenQuestionsFor] = useState(null);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("md"));

  /* -------------- Filters -------------- */
  const filteredTests = useMemo(() => {
    return sampleData
      .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
      .filter((t) => (fromDate ? t.date >= fromDate : true))
      .filter((t) => (toDate ? t.date <= toDate : true))
      .map((t) => {
        if (groupFilter === "All") return t;
        const hasGroup = t.groups.some((g) => g.groupName === groupFilter);
        return hasGroup ? t : null;
      })
      .filter(Boolean);
  }, [query, fromDate, toDate, groupFilter]);

  /* -------------- Helpers -------------- */
  const openTestDialog = (test) => {
    setSelectedTest(test);
    setSelectedGroup(null);
    setSelectedUser(null);
    setOpenQuestionsFor(null);
  };

  const closeTestDialog = () => {
    setSelectedTest(null);
    setSelectedGroup(null);
    setSelectedUser(null);
    setOpenQuestionsFor(null);
  };

  const closeUser = () => {
    setSelectedUser(null);
    setOpenQuestionsFor(null);
  };

  const groupAggregates = (test) => {
    return test.groups.map((g) => {
      const users = g.users || [];
      const avg = users.length
        ? Math.round(users.reduce((s, u) => s + (u.totalScore || 0), 0) / users.length)
        : g.summary?.avgScore || 0;
      const appeared = g.summary?.appeared ?? users.length;
      const total = g.summary?.total ?? users.length;
      return { groupName: g.groupName, avg, appeared, total, users };
    });
  };

  const moduleAveragesFor = (test) => {
    const modules = {};
    test.groups.forEach((g) => {
      (g.users || []).forEach((u) => {
        u.sections.forEach((s) => {
          modules[s.name] = modules[s.name] || { name: s.name, totalPct: 0, count: 0 };
          modules[s.name].totalPct += (s.obtained / (s.maxMarks || 1)) * 100;
          modules[s.name].count += 1;
        });
      });
    });
    return Object.values(modules).map((m) => ({ name: m.name, avg: Math.round(m.totalPct / m.count) }));
  };

  /* -------------- Certificate logic -------------- */
  // path to your static certificate PDF template (place file in public folder)
  const CERT_TEMPLATE_URL = "/assets/certificates/IDSA_spotlight_2025_Certificate_A.pdf";

  // generate a simple personalized certificate PDF client-side using jsPDF
  const generatePersonalCertificate = (user, test) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    // background / borders
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // subtle border
    doc.setLineWidth(2);
    doc.rect(30, 30, w - 60, h - 60);

    // title
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text("Certificate of Completion", w / 2, 110, { align: "center" });

    // course/test name
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text(`This certifies that`, w / 2, 160, { align: "center" });

    // recipient name
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text(user.name || "—", w / 2, 200, { align: "center" });

    // details: test, score
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${user.name || "Participant"} has successfully completed "${test.name}" with total score ${user.totalScore}/${test.maxMarks}.`,
      w / 2,
      240,
      { align: "center", maxWidth: w - 200 }
    );

    // result & date
    const passed = (user.totalScore ?? 0) >= (test.minMarks ?? 0) || user.status === "Pass";
    doc.text(`Result: ${passed ? "Passed" : "Failed"}`, w / 2, 280, { align: "center" });
    const today = new Date();
    doc.text(`Date: ${today.toLocaleDateString()}`, w / 2, 310, { align: "center" });

    // signature placeholder
    doc.setFontSize(12);
    doc.text("Authorized Signature", w - 160, h - 100, { align: "center" });
    doc.line(w - 240, h - 110, w - 80, h - 110);

    // save file
    const safeName = (user.name || "certificate").replace(/\s+/g, "_");
    doc.save(`${safeName}_${test.id}_Certificate.pdf`);
  };

  const userHasCertificate = (user, test) => {
    // determine if user is eligible for certificate:
    // either user.status === 'Pass' or totalScore >= test.minMarks
    return user && test && (user.status === "Pass" || (typeof user.totalScore === "number" && user.totalScore >= (test.minMarks ?? 0)));
  };

  /* ---------------- UI ---------------- */
  return (
    <Box p={{ xs: 2, md: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
        <Typography variant="h4">Admin — Test Results Dashboard</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => {
              setQuery("");
              setFromDate("");
              setToDate("");
              setGroupFilter("All");
            }}
          >
            Refresh
          </Button>
          <Button size="small" variant="contained" startIcon={<FileDownloadIcon />}>
            Export
          </Button>
        </Stack>
      </Stack>

      {/* Filter bar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search tests, e.g. 'Final' or 'Midterm'"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              size="small"
              label="From"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              size="small"
              label="To"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Select fullWidth size="small" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
              <MenuItem value="All">All Groups</MenuItem>
              <MenuItem value="Doctors">Doctors</MenuItem>
              <MenuItem value="Observers">Observers</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} md={1} sx={{ textAlign: { xs: "right", md: "left" } }}>
            <Tooltip title="Clear dates">
              <IconButton
                size="small"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Tests list */}
      <Grid container spacing={2}>
        {filteredTests.map((test) => (
          <Grid item xs={12} sm={6} md={4} key={test.id}>
            <Card elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6">{test.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {test.date} • Min {test.minMarks} • Avg time {test.avgTime}
                    </Typography>
                  </Box>

                  <Stack alignItems="flex-end" spacing={1}>
                    <Chip label={test.status} size="small" color={test.status === "Active" ? "success" : "default"} />
                    <Stack direction="row" spacing={1}>
                      <Button size="small" onClick={() => openTestDialog(test)}>
                        View
                      </Button>
                      <Button size="small" startIcon={<FileDownloadIcon />}>
                        Export
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 1 }} />

                {/* group summaries */}
                <Stack spacing={1}>
                  {groupAggregates(test).map((g) => (
                    <Paper
                      key={g.groupName}
                      variant="outlined"
                      sx={{ p: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 36, height: 36 }}>
                          <GroupIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{g.groupName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Avg: {g.avg} • {g.appeared}/{g.total} appeared
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedTest(test);
                            setSelectedGroup(g);
                          }}
                        >
                          Open
                        </Button>
                        <Tooltip title="View group analytics">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedTest(test);
                              setSelectedGroup(g);
                            }}
                          >
                            <BarChartIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>

              <Box sx={{ p: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Modules:{" "}
                    {Array.from(
                      new Set(
                        test.groups.flatMap((g) => (g.users || []).flatMap((u) => u.sections.map((s) => s.name)))
                      )
                    ).join(", ") || "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {test.groups.flatMap((g) => g.users || []).length} attempts
                  </Typography>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* --- Test Dialog --- */}
      <Dialog open={!!selectedTest} onClose={closeTestDialog} fullWidth maxWidth="xl" fullScreen={isSm} aria-labelledby="test-dialog-title">
        <DialogTitle id="test-dialog-title">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">{selectedTest?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                Date: {selectedTest?.date} • Min passing: {selectedTest?.minMarks} • Avg time: {selectedTest?.avgTime}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" startIcon={<FileDownloadIcon />}>
                Export
              </Button>
              <Button size="small" color="error" startIcon={<DeleteIcon />}>
                Delete
              </Button>
              <Button size="small" onClick={closeTestDialog}>
                Close
              </Button>
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          {selectedTest && (
            <Grid container spacing={2}>
              {/* Left: summary + groups */}
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1">Test Summary</Typography>
                  <Stack spacing={0.5} mt={1}>
                    <Typography variant="body2">Max Marks: {selectedTest.maxMarks}</Typography>
                    <Typography variant="body2">Min Passing: {selectedTest.minMarks}</Typography>
                    <Typography variant="body2">Avg Time: {selectedTest.avgTime}</Typography>
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="subtitle2">Groups</Typography>
                  <List dense>
                    {groupAggregates(selectedTest).map((g) => (
                      <ListItem
                        key={g.groupName}
                        secondaryAction={
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedGroup(g);
                              setSelectedUser(null);
                            }}
                          >
                            View
                          </Button>
                        }
                        disableGutters
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <GroupIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={g.groupName} secondary={`Avg ${g.avg} • ${g.appeared}/${g.total} appeared`} />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" spacing={1}>
                    <Button size="small">Export Attempts</Button>
                    <Button size="small">Export Scores</Button>
                  </Stack>
                </Paper>
              </Grid>

              {/* Right: charts + recent users */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1">Module-wise Avg</Typography>
                      <Box sx={{ height: 220 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={moduleAveragesFor(selectedTest)}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ReTooltip />
                            <Legend />
                            <Bar dataKey="avg" fill={COLORS[0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1">Pass vs Fail (demo)</Typography>
                      <Box sx={{ height: 220 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={[{ name: "Pass", value: 80 }, { name: "Fail", value: 20 }]} dataKey="value" outerRadius={80} label>
                              <Cell fill={COLORS[1]} />
                              <Cell fill={COLORS[4]} />
                            </Pie>
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1">Recent Users</Typography>
                      <Grid container spacing={1} mt={1}>
                        {selectedTest.groups
                          .flatMap((g) => g.users || [])
                          .slice(0, 8)
                          .map((u) => (
                            <Grid item xs={12} sm={6} md={3} key={u.id}>
                              <Paper variant="outlined" sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Avatar>
                                    <PersonIcon />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle2">{u.name}</Typography>
                                    <Typography variant="caption">{u.totalScore} pts • {u.status}</Typography>
                                  </Box>
                                </Stack>
                                <Button size="small" onClick={() => setSelectedUser(u)}>
                                  View
                                </Button>
                              </Paper>
                            </Grid>
                          ))}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

              {/* If group selected: show users in group and module summary for group */}
              {selectedGroup && (
                <Grid item xs={12}>
                  <Box mt={2}>
                    <Typography variant="h6">Group — {selectedGroup.groupName}</Typography>
                    <Grid container spacing={2} mt={1}>
                      {/* Group users */}
                      <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                          {selectedGroup.users.length === 0 ? (
                            <Grid item xs={12}>
                              <Paper variant="outlined" sx={{ p: 2 }}>
                                No users in this group.
                              </Paper>
                            </Grid>
                          ) : (
                            selectedGroup.users.map((u) => (
                              <Grid item xs={12} sm={6} md={4} key={u.id}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Box>
                                      <Typography variant="subtitle1">{u.name}</Typography>
                                      <Typography variant="body2">Score: {u.totalScore} • {u.status}</Typography>
                                      <Typography variant="caption">Time: {u.timeTaken}</Typography>
                                    </Box>
                                    <Stack spacing={1}>
                                      <Button size="small" onClick={() => setSelectedUser(u)}>
                                        Details
                                      </Button>
                                      <Button size="small" onClick={() => setOpenQuestionsFor(u)}>
                                        Qs
                                      </Button>
                                    </Stack>
                                  </Stack>
                                </Paper>
                              </Grid>
                            ))
                          )}
                        </Grid>
                      </Grid>

                      {/* Group modules summary */}
                      <Grid item xs={12} md={4}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle1">Module Summary</Typography>
                          <Stack spacing={1} mt={1}>
                            {(() => {
                              const modules = {};
                              selectedGroup.users.forEach((u) => {
                                u.sections.forEach((s) => {
                                  modules[s.name] = modules[s.name] || { name: s.name, totalObt: 0, totalMax: 0, count: 0, minMarks: s.minMarks || 0 };
                                  modules[s.name].totalObt += s.obtained;
                                  modules[s.name].totalMax += s.maxMarks;
                                  modules[s.name].count += 1;
                                });
                              });
                              const arr = Object.values(modules);
                              if (arr.length === 0) return <Typography variant="body2">No module data</Typography>;
                              return arr.map((m) => {
                                const pct = Math.round((m.totalObt / (m.totalMax || 1)) * 100);
                                return (
                                  <Box key={m.name}>
                                    <Stack direction="row" justifyContent="space-between">
                                      <Typography variant="body2">{m.name}</Typography>
                                      <Typography variant="caption">{pct}%</Typography>
                                    </Stack>
                                    <LinearProgress variant="determinate" value={Math.min(100, pct)} sx={{ height: 8, borderRadius: 1, my: 0.5 }} />
                                    <Typography variant="caption" color="text.secondary">
                                      Min {m.minMarks} • Avg of {m.count} attempts
                                    </Typography>
                                  </Box>
                                );
                              });
                            })()}
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* --- User Detail Dialog --- */}
      <Dialog open={!!selectedUser} onClose={closeUser} fullWidth maxWidth="md" fullScreen={isSm} aria-labelledby="user-dialog-title">
        <DialogTitle id="user-dialog-title">User Detail — {selectedUser?.name}</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 64, height: 64 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography>{selectedUser.name}</Typography>
                        <Typography variant="caption">{selectedUser.email}</Typography>
                        <Typography variant="body2">Total: {selectedUser.totalScore}</Typography>
                        <Typography variant="body2">Status: {selectedUser.status}</Typography>
                      </Box>
                    </Stack>

                    <Divider />

                    <Typography variant="subtitle2">Quick Actions</Typography>
                    <Stack direction="row" spacing={1}>
                      <Button size="small">Export Scores</Button>
                      <Button size="small">Re-issue Certificate</Button>
                    </Stack>

                    <Divider />

                    {/* Certificate area */}
                    <Typography variant="subtitle2">Certificate</Typography>
                    <Box>
                      {userHasCertificate(selectedUser, selectedTest) ? (
                        <>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            This user is eligible for a certificate.
                          </Typography>

                          {/* Embedded static template preview (optional) */}
                          <Paper variant="outlined" sx={{ p: 1, mb: 1 }}>
                            <Typography variant="caption">Template preview</Typography>
                            <Box sx={{ height: 160, mt: 1 }}>
                              {/* embedded PDF template from public folder */}
                              <embed
                                src={CERT_TEMPLATE_URL}
                                type="application/pdf"
                                width="100%"
                                height="100%"
                                style={{ borderRadius: 4, overflow: "hidden" }}
                              />
                            </Box>
                          </Paper>

                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<FileDownloadIcon />}
                              onClick={() => generatePersonalCertificate(selectedUser, selectedTest)}
                            >
                              Generate Personalized Certificate (download)
                            </Button>

                            {/* Direct download of static template if you want */}
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<FileDownloadIcon />}
                              href={CERT_TEMPLATE_URL}
                              download={`${selectedUser.name}_Certificate_Template.pdf`}
                            >
                              Download Template
                            </Button>
                          </Stack>
                        </>
                      ) : (
                        <Typography variant="body2">No certificate available (user did not pass).</Typography>
                      )}
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1">Section Breakdown</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Section</TableCell>
                          <TableCell>Obtained</TableCell>
                          <TableCell>Max</TableCell>
                          <TableCell>Min</TableCell>
                          <TableCell>Detail</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedUser.sections.map((s) => (
                          <TableRow key={s.name}>
                            <TableCell>{s.name}</TableCell>
                            <TableCell>{s.obtained}</TableCell>
                            <TableCell>{s.maxMarks}</TableCell>
                            <TableCell>{s.minMarks}</TableCell>
                            <TableCell>
                              <Button size="small" onClick={() => setOpenQuestionsFor({ ...selectedUser, section: s })}>
                                View Qs
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="subtitle1">All Questions</Typography>
                  <Box mt={1}>
                    {selectedUser.sections
                      .flatMap((s) => s.questions.map((q) => ({ ...q, section: s.name })))
                      .map((q) => (
                        <Paper key={`${q.section}-${q.qid}`} variant="outlined" sx={{ p: 1, mb: 1 }}>
                          <Grid container alignItems="center">
                            <Grid item xs={8}>
                              <Typography variant="body2">
                                [{q.section}] {q.text}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="body2">
                                {q.obtained}/{q.maxMarks}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Chip label={q.obtained === q.maxMarks ? "Full" : "Partial"} size="small" />
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUser}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* --- Questions dialog --- */}
      <Dialog open={!!openQuestionsFor} onClose={() => setOpenQuestionsFor(null)} fullWidth maxWidth="sm" aria-labelledby="questions-dialog-title">
        <DialogTitle id="questions-dialog-title">
          Questions — {openQuestionsFor?.name} {openQuestionsFor?.section ? `• ${openQuestionsFor.section.name}` : ""}
        </DialogTitle>
        <DialogContent dividers>
          {openQuestionsFor && (
            <Box>
              {(openQuestionsFor.section ? openQuestionsFor.section.questions : openQuestionsFor.sections?.flatMap((s) => s.questions) || []).map((q, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 1, mb: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2">{q.text}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Max {q.maxMarks}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {q.obtained}/{q.maxMarks}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQuestionsFor(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
