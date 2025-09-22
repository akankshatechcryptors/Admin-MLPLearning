import React, { useState, useEffect,useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import LoadingScreen from '../components/Loading';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Group } from '@mantine/core';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlayCircleIcon from '@mui/icons-material/PlayCircleFilled';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BreadCrumbs from '../components/BreadCrumb';
import { dashboardApi } from '../common/api';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await dashboardApi();
      console.log(res);
      setData(res.data);
    };
    fetchData();
  }, []);
  // KPIs
    const chartRef = useRef(null);

  
  if (!data) return <LoadingScreen message={'Loading Dashboard'} />;
  const stats = [
    {
      label: 'Total Students',
      value: data.cards.totalUsers,
      color: 'from-blue-500 to-blue-400',
      icon: <PeopleAltIcon fontSize="large" />,
    },
    {
      label: 'Total Tests',
      value: data.cards.totalExams,
      color: 'from-green-500 to-green-400',
      icon: <AssignmentIcon fontSize="large" />,
    },
    {
      label: 'Active Tests',
      value: data.cards.activeExams,
      color: 'from-yellow-500 to-yellow-400',
      icon: <PlayCircleIcon fontSize="large" />,
    },
    {
      label: 'Certificates Issued',
      value: data.cards.certificatesIssued,
      color: 'from-purple-500 to-purple-400',
      icon: <WorkspacePremiumIcon fontSize="large" />,
    },
  ];

  // Mock charts data
  const studentGrowthData = {
    labels: data.curveChart.map((d) => new Date(d.day)),
    datasets: [
      {
        label: 'New Students',
        data: data.curveChart.map((d) => d.total_users),
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F655',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Chart options
  const studentGrowthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month', // display ticks per month
          tooltipFormat: 'dd MMM', // tooltip shows exact day
          displayFormats: {
            month: 'MMM yyyy', // label on x-axis shows month
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'New Students',
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return ` ${context.parsed.y} students`;
          },
        },
      },
    },
  };

  const testPerformanceData = {
    labels: data.averagePassedStudents.map((item) => item.subject || 'N/A'),
    datasets: [
      {
        label: 'Avg Score (%)',
        data: data.averagePassedStudents.map((item) => item.score || 0),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#8B5CF6',
          '#EF4444',
        ],
        borderRadius: 8,
      },
    ],
  };

  const certificatePieData = {
    labels: ['Issued', 'Pending'],
    datasets: [
      {
        data: [
          data.pieChart.issuedCertificates,
          data.pieChart.pendingCertificates,
        ],
        backgroundColor: ['#10B981', '#F87171'],
      },
    ],
  };

  const recentActivity = [
    { text: 'Student John Doe attempted Medicine Test', time: '2h ago' },
    { text: 'Admin created new Surgery Assessment', time: '4h ago' },
    { text: '50 Certificates issued for Pediatrics Test', time: '1d ago' },
    { text: 'New student batch enrolled', time: '2d ago' },
    { text: 'Dr. Smith reviewed test analytics', time: '3d ago' },
  ];

  return (
    <Box className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Group position="apart" className="mb-4" style={{ alignItems: 'center' }}>
        <BreadCrumbs />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <div></div>
      </Group>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((s, i) => (
          <Grid item size={{ xs: 6, sm: 3 }} key={i}>
            <Paper
              className={`p-6 rounded-2xl shadow-md bg-gradient-to-r ${s.color} text-white 
                flex flex-col items-center justify-center h-40 
                backdrop-blur-sm bg-opacity-90 transition duration-300 hover:shadow-xl hover:-translate-y-1 `}
            >
              <Box className="mb-2">{s.icon}</Box>
              <Typography variant="h5" fontWeight={700}>
                {s.value}
              </Typography>
              <Typography variant="body2" className="opacity-90 mt-1">
                {s.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Student Growth */}
        <Grid item size={{ xs: 12, sm: 8 }}>
          <Paper className="p-4 rounded-2xl shadow-md h-full bg-white">
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              📈 Student Growth
            </Typography>
            <Box sx={{ height: 280, position: 'relative' }}>
              <Line
                key={data.curveChart.map(d => d.total_users).join('-')} // unique per dataset
                data={studentGrowthData}
                options={studentGrowthOptions}
              />
            </Box>
          </Paper>
        </Grid>
        {/* Certificates Pie */}
        <Grid item size={{ xs: 12, sm: 4 }}>
          <Paper className="p-4 rounded-2xl shadow-md h-full bg-white">
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              🏆 Certificates Status
            </Typography>
            <Box sx={{ height: 240, position: 'relative' }}>
              <Pie
                data={certificatePieData}
                 key={[data.pieChart.issuedCertificates, data.pieChart.pendingCertificates]}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
        {/* Test Performance */}
        <Grid item size={{ xs: 12, sm: 12 }}>
          <Paper className="p-4 rounded-2xl shadow-md h-full bg-white">
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              📊 Test Performance
            </Typography>
            <Box sx={{ height: 280, position: 'relative' }}>
              <Bar
              data={testPerformanceData}
                key={data.testPerformanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item size={{ xs: 12, sm: 12 }}>
          <Paper className="p-4 rounded-2xl shadow-md h-full bg-white">
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              📝 Recent Activity
            </Typography>
            <Divider />
            <List sx={{ maxHeight: 260, overflowY: 'auto' }}>
              {recentActivity.map((a, i) => (
                <ListItem key={i} divider>
                  <ListItemText
                    primary={a.text}
                    secondary={a.time}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
