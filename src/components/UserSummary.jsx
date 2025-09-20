import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import VideocamIcon from "@mui/icons-material/Videocam";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VerifiedIcon from "@mui/icons-material/Verified";

const PASTEL_COLORS = ["#A8DADC", "#F4A261", "#E9C46A", "#F6BD60", "#84A59D", "#90BE6D"];

const UserSummary = ({ user, test, onBack }) => {
    if (!user || !test) {
    return null; // or a fallback UI
  }


  // Build userModules array based on test.modules
  const userModules = test.modules.map((m) => ({
    id: m.id,
    name: m.name,
    maxMarks: m.maxMarks,
    media: m.media,
    obtained: user.obtained[m.id] ?? 0,
  }));

  const totalMarks = userModules.reduce((s, m) => s + m.obtained, 0);
  const maxTotal = userModules.reduce((s, m) => s + m.maxMarks, 0);
  const passed = totalMarks >= test.minMarks;

  return (
    <Box>
      {/* Back Button */}
      <Button onClick={onBack} sx={{ mb: 2 }} variant="outlined">
        ← Back
      </Button>

      {/* User Name */}
      <Typography variant="h6" mb={1}>
        {user.name} — Performance
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Module-wise Bar Chart */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Module Performance
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userModules}>
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis domain={[0, Math.max(...userModules.map((m) => m.maxMarks))]} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="obtained"
              fill={PASTEL_COLORS[2]}
              radius={[6, 6, 0, 0]}
              name="Obtained Marks"
            />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Total Score */}
      <Typography
        variant="body1"
        mb={2}
        sx={{ fontWeight: "bold", color: passed ? "success.main" : "error.main" }}
      >
        Total Score: {totalMarks}/{maxTotal} — {passed ? "Passed ✅" : "Failed ❌"}
      </Typography>

      {/* Detailed Results Table */}
      <Paper sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.100" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Module</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Obtained
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Max
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Media</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userModules.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.name}</TableCell>
                  <TableCell align="right">{m.obtained}</TableCell>
                  <TableCell align="right">{m.maxMarks}</TableCell>
                  <TableCell>
                    {m.media && (
                      <Link
                        href={m.media.url}
                        target="_blank"
                        rel="noopener"
                        underline="hover"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          fontWeight: 500,
                        }}
                      >
                        {m.media.type === "video" ? (
                          <VideocamIcon fontSize="small" />
                        ) : (
                          <PictureAsPdfIcon fontSize="small" />
                        )}
                        {m.media.type.toUpperCase()}
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Certificate Button */}
      {passed && (
        <Button
          variant="contained"
          color="success"
          startIcon={<VerifiedIcon />}
          onClick={() => window.open("https://example.com/certificate.pdf", "_blank")}
          sx={{ borderRadius: 2 }}
        >
          View Certificate
        </Button>
      )}
    </Box>
  );
};

export default UserSummary;
