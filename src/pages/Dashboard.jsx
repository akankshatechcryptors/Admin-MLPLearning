import React, { useState, useEffect,useContext } from 'react';
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
import {useNavigate} from 'react-router-dom'
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
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // important for time axis
import AuthContext from '../common/AuthContext'
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
  TimeScale
);

export default function AdminDashboard() {
  const navigate=useNavigate()
  const [data, setData] = useState(null);
  const auth=useContext(AuthContext)
  useEffect(() => {
    const fetchData = async () => {
      const res = await dashboardApi();
      setData(res.data);
    };
    fetchData();
  }, []);

  if (!data) return <LoadingScreen message={'Loading Dashboard'} />;

  // KPI Cards
const stats = [
  {
    label: 'Total Users',
    value: data.cards.totalUsers,
    color: ['#3B82F6', '#60A5FA'], // blue gradient from Tailwind blue-500 → blue-400
    icon: <PeopleAltIcon fontSize="large" />,
    onClick: () => {
        if (auth.userType === 'superadmin') {
          navigate('/users');
        } else {
          alert('You are not authorized to view users.');
        }
      },
  },
  {
    label: 'Total Tests',
    value: data.cards.totalExams,
    color: ['#10B981', '#34D399'], // green gradient
    icon: <AssignmentIcon fontSize="large" />,
  },
  {
    label: 'Active Tests',
    value: data.cards.activeExams,
    color: ['#F59E0B', '#FBBF24'], // yellow gradient
    icon: <PlayCircleIcon fontSize="large" />,
  },
  {
    label: 'Certificates Issued',
    value: data.cards.certificatesIssued,
    color: ['#8B5CF6', '#A78BFA'], // purple gradient
    icon: <WorkspacePremiumIcon fontSize="large" />,
  },
];

  // Student Growth Line Chart
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

  const studentGrowthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          tooltipFormat: 'dd MMM',
          displayFormats: {
            month: 'MMM yyyy',
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

  // Test Performance Bar Chart
console.log(data.averagePassedStudents)
const testPerformanceData = {
  labels: data.averagePassedStudents.map((item) => `${item.title}` || "N/A"),
  datasets: [
    {
      label: "Avg Passing Rate (%)",
      data: data.averagePassedStudents.map(
        (item) => (item.avg_passed_students_per_exam || 0) * 100 // convert 0.25 → 25%
      ),
      backgroundColor: [
        "#3B82F6",
        "#10B981",
        "#F59E0B",
        "#8B5CF6",
        "#EF4444",
      ],
      borderRadius: 8,

      // keep arrays for tooltip reference
      totalAlloted: data.averagePassedStudents.map(
        (item) => item.total_alloted_users || 0
      ),
      totalPassed: data.averagePassedStudents.map(
        (item) => item.total_passed_users || 0
      ),
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false, // <-- very important for full width
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          const dataset = context.dataset;
          const index = context.dataIndex;

          const avg = dataset.data[index];
          const allotted = dataset.totalAlloted[index];
          const passed = dataset.totalPassed[index];

          return [
            `Avg Passing Rate: ${avg}%`,
            `Total Allotted: ${allotted}`,
            `Total Passed: ${passed}`,
          ];
        },
      },
    },
  },
};

  // Certificates Pie Chart
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

  // Recent Activity (static example)
  const recentActivity = [
    { text: 'Student John Doe attempted Medicine Test', time: '2h ago' },
    { text: 'Admin created new Surgery Assessment', time: '4h ago' },
    { text: '50 Certificates issued for Pediatrics Test', time: '1d ago' },
    { text: 'New student batch enrolled', time: '2d ago' },
    { text: 'Dr. Smith reviewed test analytics', time: '3d ago' },
  ];

  return (
    <Box className="p-[2vw] bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Group position="apart" className="mb-4" style={{ alignItems: 'center' }}>
        <BreadCrumbs />  
      </Group>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((s, i) => (
          <Grid item size={{xs:6, sm:3}} key={i}>
              <Paper
  sx={{
    p: 6, // padding
    borderRadius: '20px', // Tailwind's 2xl ≈ 1rem * 2? or use 16px-24px
    boxShadow: 3, // Tailwind shadow-md
    background: `linear-gradient(to right, ${s.color})`,
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 160, // h-40 ≈ 10rem = 160px
    backdropFilter: 'blur(5px)',
    backgroundOpacity: 0.9, // MUI doesn't support directly, handled via rgba
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: 6, // shadow-xl
      transform: 'translateY(-4px)',
    },
  }}
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
        <Grid item size={{xs:12, sm:8,md:8}}>
          <Paper className="p-4 rounded-2xl shadow-md h-full bg-white">
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              📈 Student Growth
            </Typography>
            <Box sx={{ height: 280, position: 'relative' }}>
              <Line
                key={data.curveChart.map(d => d.total_users).join('-')}
                data={studentGrowthData}
                options={studentGrowthOptions}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Certificates Pie */}
        <Grid item size={{xs:12, sm:4,md:4}} >
          <Paper className="p-4 rounded-2xl shadow-md h-full bg-white">
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              🏆 Certificates Status
            </Typography>
            <Box sx={{ height: 240, position: 'relative' }}>
              <Pie
                key={`${data.pieChart.issuedCertificates}-${data.pieChart.pendingCertificates}`}
                data={certificatePieData}
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
        <Grid item size={{xs:12, sm:12,md:12}}>
          <Paper className="p-4 rounded-2xl shadow-md h-full bg-white">
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              📊 Test Performance
            </Typography>
            <Box sx={{width:"100%", height: 280, position: 'relative' }}>
              <Bar
                key={data.averagePassedStudents.map(i => i.score).join('-')}
                data={testPerformanceData}
                options={options}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        {/* <Grid item size={{xs:12, sm:12,md:12}}>
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
        </Grid> */}
      </Grid>
    </Box>
  );
}
