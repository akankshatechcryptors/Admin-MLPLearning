import React,{useEffect,useState} from "react";
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
import { saveAs } from "file-saver";
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
import {encryptFilename} from'../common/pdfCrypt'
import {imgUrl} from '../common/api'
const PASTEL_COLORS = ["#A8DADC", "#F4A261", "#E9C46A", "#F6BD60", "#84A59D", "#90BE6D"];

const UserSummary = ({ user, test, onBack }) => {
   const [pdfUrl, setPdfUrl] = useState(null);
   useEffect(() => {
    if (user&& test) {
      const encryptedName = encryptFilename(`${user.id}_${test.exam_id}`);
      const certificateKey = `${imgUrl}/uploads/certificates/${encryptedName}.pdf`;
      // Directly set URL for preview (server must serve these files)
      setPdfUrl(certificateKey);
    }
  }, [user, test]);
   const handleDownload = () => {
    if (pdfUrl) {
      //console.log(pdfUrl)
      saveAs(pdfUrl, `Certificate_${test.id || "NA"}.pdf`);
    }
  };

  if (!user || !test) return null;

  const userModules = test.sections.map((section) => {
    const obtainedObj = user.obtained.find((o) => o.sectionId === section.id);
    return {
      id: section.id,
      name: section.name,
      maxMarks: section.maxMarks,
      media: section.media,
      obtained: obtainedObj ? obtainedObj.marks : 0,
      status: obtainedObj ? obtainedObj.status : "pending",
    };
  });

  const totalMarks = userModules.reduce((s, m) => s + m.obtained, 0);
  const maxTotal = userModules.reduce((s, m) => s + m.maxMarks, 0);
  const passed = user.status==='pass';

 const calcUserModules = (user, sections) => {
  return sections.map((section) => {
    const obtained = user.obtained || [];
    const sectionData = obtained.find((o) => o.sectionId === section.id);
    const timeSpent = sectionData?.time_spent || 0;

    // Convert to HH:MM:SS
    const hours = Math.floor(timeSpent / 3600);
    const minutes = Math.floor((timeSpent % 3600) / 60);
    const seconds = timeSpent % 60;
    const formattedTime = `${hours}h ${minutes}m ${seconds}s`;

    return {
      id: section.id,
      name: section.name,
      timeSpent,
      formattedTime,
    };
  });
};

function secondsToHoursMinutes(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}


  return (
    <Box>
      <Button onClick={onBack} sx={{ mb: 2 }} variant="outlined">
        ← Back
      </Button>

      <Typography variant="h6" mb={1}>
        {user.name} — Performance
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Module Performance Bar Chart */}
     <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
    <Typography variant="subtitle1" gutterBottom>
      Module-wise Time Spent: {user.name}
    </Typography>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={calcUserModules(user, test.sections)}>
        <XAxis dataKey="name" />
        <YAxis domain={[0, Math.max(...user.obtained.map(o => o.time_spent || 0))]} />
        <Tooltip formatter={(value) => secondsToHoursMinutes(value)} />
        <Legend />
        <Bar dataKey="timeSpent" fill={PASTEL_COLORS[2]} radius={[5, 5, 0, 0]} />
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
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Marks (Obtained / Max)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userModules.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.name}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color:
                        m.status === "pass"
                          ? "success.main"
                          : m.status === "fail"
                          ? "error.main"
                          : "text.secondary",
                    }}
                  >
                    {m.obtained} / {m.maxMarks}
                  </TableCell>
                  <TableCell                  
                     align="center"
                    sx={{
                      fontWeight: "bold",
                      color:
                        m.status === "pass"
                          ? "success.main"
                          : m.status === "fail"
                          ? "error.main"
                          : "text.secondary",
                    }}>
                    {m.status}
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
          onClick={handleDownload}
          sx={{ borderRadius: 2 }}
        >
          View Certificate
        </Button>
      )}
    </Box>
  );
};

export default UserSummary;
