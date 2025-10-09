import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PASTEL_COLORS = [
  "#90BE6D",
  "#A8DADC",
  "#F4A261",
  "#E9C46A",
  "#F6BD60",
  "#84A59D"
];
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

// Module-wise average
// Module-wise average for only attempted users (pass/fail)
// Module-wise average for only passed users, matching sectionId
// Module-wise pass percentage relative to total users
const calcTestModules = (test) => {
  const totalUsers = test.total_alloted_users || 0;

  return test.sections.map((section) => {
    let passedUsers = 0;

    (test.groups || []).forEach((group) => {
      (group.users || []).forEach((user) => {
        // Check if user passed this section
        const obtainedForSection = (user.obtained || []).find(
          (o) => o.sectionId === section.id && o.status === "pass"
        );

        if (obtainedForSection) {
          passedUsers += 1;
        }
      });
    });

    // Avg = % of users who passed this module
    const avg = totalUsers ? Math.round((passedUsers / totalUsers) * 100) : 0;

    return {
      name: section.name,
      avg,
      passedUsers,
      totalUsers,
      id: section.id,
    };
  });
};



// Pass/fail calculation
// Convert user.status to display text
const getStatusPieData = (users) => {
  const pass = (users || []).filter(u => u.status === "pass").length;
  const fail = (users || []).filter(u => u.status === "fail").length;
  const pending = (users || []).filter(u => !u.status).length;

  return [
    { name: "Pass", value: pass },
    { name: "Fail", value: fail },
    { name: "Pending", value: pending },
  ];
};
const getGroupStatusCounts = (users) => {
  const pass = (users || []).filter(u => u.status === "pass").length;
  const fail = (users || []).filter(u => u.status === "fail").length;
  const pending = (users || []).filter(u => !u.status).length; // unattempted
  return { pass, fail, pending };
};





const TestSummary = ({ test, onGroupSelect }) => {
  const allUsers = (test.groups || []).flatMap((g) => g.users || []);
  const modules = test.sections || [];
  return (
    <Grid container spacing={3}>
      {/* Module-wise Average */}
      <Grid item size={{sx:12,md:8,lg:8 ,sm:8}}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Module-wise Average
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={calcTestModules(test)}>
              <XAxis dataKey="name" />
             <YAxis 
  domain={[
    0,
    Math.max(
      10, // minimum visible height
      ...modules.map(m => Math.max(m.maxMarks || 0, calcTestModules(test).find(x => x.id === m.id)?.avg || 0))
    )
  ]}
/>
              <Tooltip />
              <Legend />
              <Bar dataKey="avg" fill={PASTEL_COLORS[0]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Pass vs Fail */}
      <Grid item size={{sx:12,md:4,lg:4 ,sm:4}}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, textAlign: "center", height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Pass vs Fail
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={getStatusPieData(allUsers)}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {getStatusPieData(allUsers).map((entry, index) => (
                  <Cell key={`c-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Groups */}
      <Grid item size={{sx:12,md:12,lg:12 ,sm:12}}>
        <Typography variant="h6" gutterBottom>
          Groups
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {(test.groups || []).map((g) => (
            <Grid item size={{sx:2,md:3,lg:3 ,sm:4}} key={g.groupName}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 5 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {g.groupName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Users: {(g.users || []).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pass - {getGroupStatusCounts(g.users).pass}{" "}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    Fail - {getGroupStatusCounts(g.users).fail}{" "}
                    </Typography >
                    <Typography variant="body2" color="text.secondary">
                    Pending:{" "} -  {getGroupStatusCounts(g.users).pending} 
                  </Typography>
                </Box>
                <Button sx={{ mt: 2 }} size="small" variant="outlined" onClick={() => onGroupSelect(g)}>
                  Open Group
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TestSummary;
