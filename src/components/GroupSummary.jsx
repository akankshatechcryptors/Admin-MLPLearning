import React,{useState} from "react";
import { Grid, Paper, Typography, Button, Box, Chip } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import ExportToExcelButton from "./ExcelExport";
const PASTEL_COLORS = ["#A8DADC", "#F4A261", "#E9C46A", "#F6BD60", "#84A59D", "#90BE6D"];
import { downloadCertificate } from "../common/api";

// Module-wise average for a single group
const calcGroupModules = (group, sections) => {
  return sections.map((section) => {
    const users = group.users || [];

    // Sum all users' time_spent for this section
    const totalTimeInSeconds = users.reduce((sum, user) => {
      const obtained = user.obtained || [];
      const sectionData = obtained.find((o) => o.sectionId === section.id);
      return sum + (sectionData?.time_spent || 0);
    }, 0);

    // Convert total seconds → hours, minutes, seconds
    const hours = Math.floor(totalTimeInSeconds / 3600);
    const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
    const seconds = totalTimeInSeconds % 60;

    // Format: HHh MMm SSs
    const formattedTime = `${hours}h ${minutes}m ${seconds}s`;

    return {
      id: section.id,
      name: section.name,
      totalTimeInSeconds,
      formattedTime,
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

//convert time spend to hours, minutes, seconds
function secondsToHoursMinutes(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

//handle download certificate 

;


const GroupSummary = ({ group, test, onUserSelect, onBack }) => {
  const [disabling, setDisabling] = useState(false);
const handleDownloadCertificate = async (group) => {
  setDisabling(true);
  try {
    const data = { group_id: group.group_id };

    // 🔹 Make sure your API call is set up to handle binary response
    const res = await downloadCertificate(data);

    // 🔹 Create a blob from the response
    const blob = new Blob([res.data], { type: 'application/zip' });

    // 🔹 Create a temporary download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificates_${group.groupName}.zip`;

    // 🔹 Trigger download
    document.body.appendChild(link);
    link.click();

    // 🔹 Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading certificates:', error);
  } finally {
    setDisabling(false);
  }
};

  const modulesData = calcGroupModules(group, test.sections);
  //console.log('group: ',group)
  const pieData = getStatusPieData(group.users);
  const totalMaxMarks = test.sections.reduce((sum, s) => sum + (s.maxMarks || 0), 0);
  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Group: {group.groupName}
      </Typography>
      <Grid container spacing={3}>
        {/* Module-wise Average Chart */}
        <Grid item size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Module-wise Average
            </Typography>
           <ResponsiveContainer width="100%" height={250}>
  <BarChart data={modulesData}>
    <XAxis dataKey="name" />
    <YAxis domain={[0, Math.max(...modulesData.map((m) => m.totalTimeInSeconds))]} />
    <Tooltip formatter={(value) => secondsToHoursMinutes(value)} />
    <Legend />
    <Bar dataKey="totalTimeInSeconds" fill={PASTEL_COLORS[1]} radius={[5, 5, 0, 0]} />
  </BarChart>
</ResponsiveContainer>

          </Paper>
        </Grid>

        {/* Pass vs Fail Chart */}
        <Grid item size={{ xs: 12, md: 4 }}>
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

        <Grid item size={{ xs: 12 }} className="flex justify-end items-center">
          <Button size="small" 
          disabled={disabling}
          sx={{ mt: 1 }} onClick={()=>handleDownloadCertificate(group)} variant="outlined">
            Download Certificate
          </Button>
        </Grid>

        {/* Users List */}
        <Grid item size={{ sm: 12 }}>

          <Grid container spacing={2}>
            {group.users.map((u) => {
              const total = test.sections.maxMarks;
              const passed = u.status;
              const timeSpentbyUser = secondsToHoursMinutes(u.time_spent);
              return (
                <Grid item size={{ sm: 3 }} key={u.id}>
                  <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>

                    <Typography variant="subtitle1">{u.name}</Typography>
                    <Typography variant="body2" className="pt-1" > <AccessTimeIcon sx={{ color: 'primary.main', fontSize: '1.1vw' }} /> {timeSpentbyUser}</Typography>

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
