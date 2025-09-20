import React from "react";
import { Grid, Paper, Typography, Button, Box, Chip } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const PASTEL_COLORS = ["#A8DADC", "#F4A261", "#E9C46A", "#F6BD60", "#84A59D", "#90BE6D"];

// Calculate module-wise average for a group
const calcGroupModules = (group, testModules) => {
  return testModules.map((mod) => {
    let total = 0;
    let count = 0;
    group.users.forEach((u) => {
      if (u.obtained[mod.id] != null) {
        total += u.obtained[mod.id];
        count += 1;
      }
    });
    return { name: mod.name, avg: count ? Math.round(total / count) : 0 };
  });
};

// Pass/fail for a group
const passFailData = (users, testModules, minMarks) => {
  const pass = users.filter((u) => {
    const total = testModules.reduce((sum, m) => sum + (u.obtained[m.id] || 0), 0);
    return total >= minMarks;
  }).length;
  const fail = users.length - pass;
  return [
    { name: "Pass", value: pass },
    { name: "Fail", value: fail },
  ];
};

const GroupSummary = ({ group, test, onUserSelect, onBack }) => {
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
              <BarChart data={calcGroupModules(group, test.modules)}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, Math.max(...test.modules.map((m) => m.maxMarks))]} />
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
                  data={passFailData(group.users, test.modules, test.minMarks)}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {passFailData(group.users, test.modules, test.minMarks).map((entry, index) => (
                    <Cell key={`c-${index}`} fill={PASTEL_COLORS[index]} />
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
              const total = test.modules.reduce((sum, m) => sum + (u.obtained[m.id] || 0), 0);
              const passed = total >= test.minMarks;
              return (
                <Grid item size={{sm:3}} key={u.id}>
                  <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="subtitle2">{u.name}</Typography>
                    <Typography variant="caption">Total: {total}/{test.modules.reduce((s,m)=>s+m.maxMarks,0)}</Typography>
                    <Chip
                      label={passed ? "Pass" : "Fail"}
                      color={passed ? "success" : "error"}
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
