import React from "react";
import { Grid, Paper, Typography, Button, Box, Chip } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import ExportToExcelButton from "./ExcelExport";
const PASTEL_COLORS = ["#A8DADC", "#F4A261", "#E9C46A", "#F6BD60", "#84A59D", "#90BE6D"];

// Module-wise average for a single group
const calcGroupModules = (group, sections) => {
  return sections.map((section) => {
    const users = group.users || [];
    const totalUsers = users.length;

    const passedUsers = users.filter((user) =>
      (user.obtained || []).some((o) => o.sectionId === section.id && o.status === "pass")
    ).length;

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

// Pass/Fail/Pending data for pie chart
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

const GroupSummary = ({ group, test, onUserSelect, onBack }) => {
   const modulesData = calcGroupModules(group, test.sections);
  const pieData = getStatusPieData(group.users);
  const totalMaxMarks = test.sections.reduce((sum, s) => sum + (s.maxMarks || 0), 0);
  return (
    <Box>
      <Button onClick={onBack} sx={{ mb: 2 }} variant="outlined">← Back to Test</Button>
      <Typography variant="h6" mb={2}>
        Group: {group.groupName}
      </Typography>
      <Grid container spacing={3}>
        {/* Module-wise Average Chart */}
        <Grid item size={{xs:12, md:8}}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Module-wise Average
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={calcGroupModules(group, test.sections)}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, Math.max(...test.sections.map((m) => m.maxMarks))]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg" fill={PASTEL_COLORS[1]} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pass vs Fail Chart */}
        <Grid item size={{xs:12, md:4}}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Pass vs Fail
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
      data={getStatusPieData(group.users)}
      dataKey="value"
      nameKey="name"
      outerRadius={100}
      label
    >
     {getStatusPieData(group.users).map((entry, index) => (
                  <Cell key={`c-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
                ))}
    </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Users List */}
        <Grid item size={{sm:12}}>
          <Grid container spacing={2}>
            {group.users.map((u) => {
              const total = test.sections.maxMarks;
              const passed = u.status;
              return (
                <Grid item size={{sm:3}} key={u.id}>
                  <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="subtitle2">{u.name}</Typography>
                    <Chip
                      label={
    u.status === "pass"
      ? "Pass"
      : u.status === "fail"
      ? "Fail"
      : "Pending"
  }
                       color={
    u.status === "pass"
      ? "success"
      : u.status === "fail"
      ? "error"
      : "warning"
  }
                      size="small"
                      sx={{ mt: 1, mb: 1 }}
                    />
                   
                    <Button size="small" sx={{ mt: 1 }} onClick={() => onUserSelect(u)}>
                      Details
                    </Button>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GroupSummary;
