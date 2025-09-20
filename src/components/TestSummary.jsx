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
  "#A8DADC",
  "#F4A261",
  "#E9C46A",
  "#F6BD60",
  "#84A59D",
  "#90BE6D",
];

// Calculate module-wise average marks
const calcTestModules = (test) => {
  return test.modules.map((mod) => {
    let total = 0;
    let count = 0;
    test.groups.forEach((g) => {
      g.users.forEach((u) => {
        if (u.obtained[mod.id] != null) {
          total += u.obtained[mod.id];
          count += 1;
        }
      });
    });
    return { name: mod.name, avg: count ? Math.round(total / count) : 0 };
  });
};

// Calculate pass/fail based on total obtained marks
const passFailData = (users, modules, minMarks) => {
  const pass = users.filter((u) => {
    const total = modules.reduce(
      (sum, m) => sum + (u.obtained[m.id] || 0),
      0
    );
    return total >= minMarks;
  }).length;
  const fail = users.length - pass;
  return [
    { name: "Pass", value: pass },
    { name: "Fail", value: fail },
  ];
};

const TestSummary = ({ test, onGroupSelect }) => {
  const allUsers = test.groups.flatMap((g) => g.users);

  return (
    <Grid container spacing={3}>
      {/* Module-wise Average Chart */}
      <Grid item size={{xs:12 ,sm:8}}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            height: "100%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Module-wise Average
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={calcTestModules(test)}>
              <XAxis dataKey="name" />
              <YAxis
                domain={[0, Math.max(...test.modules.map((m) => m.maxMarks))]}
              />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="avg"
                fill={PASTEL_COLORS[0]}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Pass vs Fail Chart */}
      <Grid item size={{xs:12 ,sm:4}}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            textAlign: "center",
            height: "100%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Pass vs Fail
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={passFailData(allUsers, test.modules, test.minMarks)}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {passFailData(allUsers, test.modules, test.minMarks).map(
                  (entry, index) => (
                    <Cell
                      key={`c-${index}`}
                      fill={PASTEL_COLORS[index % PASTEL_COLORS.length]}
                    />
                  )
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Groups Summary */}
      <Grid item size={{xs:12 ,sm:12 }}>
        <Typography variant="h6" gutterBottom>
          Groups
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {test.groups.map((g, idx) => (
            <Grid item size={{xs:12 ,sm:3}}key={g.groupName}>
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
                  <Typography variant="subtitle1" fontWeight="bold">
                    {g.groupName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Users: {g.users.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pass / Fail:{" "}
                    {passFailData(g.users, test.modules, test.minMarks)[0]
                      .value}{" "}
                    /{" "}
                    {passFailData(g.users, test.modules, test.minMarks)[1]
                      .value}
                  </Typography>
                </Box>
                <Button
                  sx={{ mt: 2 }}
                  size="small"
                  variant="outlined"
                  onClick={() => onGroupSelect(g)}
                >
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
