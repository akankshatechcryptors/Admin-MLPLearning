import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import LoadingScreen from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import { getGroups, dashboardApi, testSummary } from '../common/api';
import ExportToExcelButton from '../components/ExportDashBoard';
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
import 'chartjs-adapter-date-fns';
import AuthContext from '../common/AuthContext';
import { Group } from '@mantine/core';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BreadCrumbs from '../components/BreadCrumb';
// ✅ Updated sample data
import { format } from 'date-fns';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  TimeScale,
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groupName,setGroupName]=useState('')

  // Fetch Groups
  const getGroupdata = async () => {
    try {
      const res = await getGroups();
      //console.log('getGroups response:', res.data); // Debug groups response
      if (!res.data.error) {
        setGroups(res.data.groups || []);
      } else {
        console.error('Error in getGroups response:', res.data.error);
        setError('Failed to fetch groups.');
      }
    } catch (err) {
      console.error('Failed to fetch groups:', err.response || err.message);
      setError('Failed to fetch groups.');
    }
  };

  // Fetch Dashboard or Group-Specific Data
  const fetchDashboardData = async (groupId = '') => {
    try {
      setLoading(true);
      setError(null);
      let res;
      if (groupId) {
        //console.log('Fetching testSummary for groupId:', groupId); // Debug groupId
        res = await testSummary({group_id:groupId});
        console.log('testSummary response:', res.data); // Debug API response

        // Validate response structure
        if (!res.data) {
          throw new Error('No data returned from testSummary');
        }
        if (!res.data.exams) {
          console.warn('No exams found in testSummary response');
          setData({
            cards: {
              totalUsers: 0,
              totalExams: 0,
              activeExams: 0,
              certificatesIssued: 0,
            },
            curveChart: [],
            averagePassedStudents: [],
            pieChart: { issuedCertificates: 0, pendingCertificates: 0 },
          });
          return;
        }

        const exams = res.data.exams || [];
        const totalUsers = exams[0]?.total_alloted_users;

        const totalExams = format(
          new Date(res.data.exams[0].start_date),
          ' MMM yyyy',
        );
        const activeExams = format(
          new Date(res.data.exams[0].end_date),
          ' MMM yyyy',
        );

        const certificatesIssued = exams.reduce((sum, exam) => {
          return (
            sum +
            (exam.groups?.reduce(
              (gSum, g) =>
                gSum +
                (g.users?.filter((u) => u.status === 'pass').length || 0),
              0,
            ) || 0)
          );
        }, 0);

        const calcGroupModules = (group, sections) => {
          return sections.map((section) => {
            const users = group.users || [];
            const totalTimeInSeconds = users.reduce((sum, user) => {
              const obtained = user.obtained || [];
              const sectionData = obtained.find(
                (o) => o.sectionId == section.id,
              );
              return sum + (sectionData?.time_spent || 0);
            }, 0);

            const hours = Math.floor(totalTimeInSeconds / 3600);
            const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
            const seconds = totalTimeInSeconds % 60;

            const formattedTime = `${hours}h ${minutes}m ${seconds}s`;

            return {
              id: section.id,
              name: section.name,
              totalTimeInSeconds,
              formattedTime,
            };
          });
        };

        const averagePassedStudents = exams.map((exam) => {
          let moduleTimes = [];

          (exam.groups || []).forEach((group) => {
            if (group.group_id == groupId) {
              // <- use == for string/number
              moduleTimes = calcGroupModules(group, exam.sections || []);
            }
          });

          return {
            title: exam.title || 'Unnamed Exam',
            moduleTimes,
            avg_passed_students_per_exam:
              exam.groups?.reduce(
                (sum, g) =>
                  sum +
                  (g.users?.filter((u) => u.status === 'pass').length || 0),
                0,
              ) / (exam.groups?.length || 1) || 0,
            originalExam: exam,
          };
        });

        const issued = certificatesIssued;
        const pending = totalUsers - issued;

        // Populate curveChart with section-wise time for the selected group
        const curveChart = averagePassedStudents.flatMap((exam) =>
          (exam.moduleTimes || []).map((section, index) => ({
            day: `Module ${index + 1}`, // <-- Use index instead of full section name
            total_time: section.totalTimeInSeconds / 3600, // Convert to hours
          })),
        );
        const modulePassingRates = averagePassedStudents.flatMap((exam) =>
          (exam.moduleTimes || []).map((module, index) => {
            // Count passed users for this module
            const passedUsers =
              (exam.originalExam.groups || [])
                .find((g) => g.group_id == groupId)
                ?.users.filter((u) => {
                  const sec = u.obtained.find((o) => o.sectionId === module.id);
                  return sec?.status === 'pass';
                }).length || 0;

            const totalUsers =
              (exam.originalExam.groups || []).find(
                (g) => g.group_id == groupId,
              )?.users.length || 1;

            return {
              module: `Module ${index + 1}`,
              passingRate: (passedUsers / totalUsers) * 100,
            };
          }),
        );

        const newData = {
          cards: {
            totalUsers,
            totalExams,
            activeExams,
            certificatesIssued,
          },
          curveChart,
          modulePassingRates,
          pieChart: {
            issuedCertificates: issued,
            pendingCertificates: pending,
          },
        };

        //console.log('Setting new data:', newData); // Debug data before setting
        setData(newData);
      } else {
        //console.log('Fetching dashboardApi'); // Debug default dashboard
        res = await dashboardApi();
        //console.log('dashboardApi response:', res.data); // Debug API response
        setData(res.data);
        
      }
    } catch (err) {
      console.error(
        'Failed to fetch dashboard data:',
        err.response || err.message,
      );
      setError('Failed to load dashboard data. Please try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    //console.log('Initial fetch: groups and dashboard data');
    getGroupdata();
    fetchDashboardData();
  }, []);

  // Fetch data when group changes
  useEffect(() => {
    //console.log('Selected group changed:', selectedGroup);
    fetchDashboardData(selectedGroup);
  }, [selectedGroup]);

  // Log data updates for debugging
  useEffect(() => {
    //console.log('Data state updated:', data);
  }, [data]);

  if (loading) return <LoadingScreen message={'Loading Dashboard...'} />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Typography>No data available.</Typography>;
 const stats = [
    {
      label: 'Total Users',
      value: data.cards.totalUsers || 0,
      color: ['#3B82F6', '#60A5FA'],
      icon: <PeopleAltIcon fontSize="large" />,
      onClick: () => {
        if (auth.type === 'superadmin')
          navigate('/users', { state: { id: selectedGroup, title: groupName } });
        else alert('You are not authorized to view users.');
      },
    },
    {
      label: selectedGroup ? 'Start Date' : 'Total Tests',
      value: selectedGroup ? data.cards.startDate || '-' : data.cards.totalExams,
      color: ['#10B981', '#34D399'],
      icon: selectedGroup ? (
        <CalendarMonthIcon fontSize="large" />
      ) : (
        <AssignmentIcon fontSize="large" />
      ),
    },
    {
      label: selectedGroup ? 'End Date' : 'Active Tests',
      value: selectedGroup ? data.cards.endDate || '-' : data.cards.activeExams,
      color: ['#F59E0B', '#FBBF24'],
      icon: selectedGroup ? (
        <EventAvailableIcon fontSize="large" />
      ) : (
        <PlayCircleIcon fontSize="large" />
      ),
    },
    {
      label: 'Certificates Issued',
      value: data.cards.certificatesIssued,
      color: ['#8B5CF6', '#A78BFA'],
      icon: <WorkspacePremiumIcon fontSize="large" />,
      onClick: () => {
        if (auth.type === 'superadmin')
          navigate('/certificates', {
            state: { group_id: selectedGroup, groupName },
          });
        else alert('You are not authorized to view certificates.');
      },
    },
  ];

  // Helper function to convert seconds → hh:mm:ss
const formatTime = (seconds) => {
  if (!seconds) return '00:00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};


  // Student Growth Line Chart (Section-wise time when group is selected)
  const studentGrowthData = {
    labels: (data.curveChart || []).map((d) => d.day),
    datasets: [
      {
        label: selectedGroup ? 'Time Spent (Hours)' : 'New Students',
        data: (data.curveChart || []).map(
          (d) => d.total_time || d.total_users || 0,
        ),
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
        type: selectedGroup ? 'category' : 'time',
        time: selectedGroup
          ? undefined
          : { unit: 'month', displayFormats: { month: 'MMM yyyy' } },
        title: { display: true, text: selectedGroup ? 'Section' : 'Date' },
      },
      y: {
        title: {
          display: true,
          text: selectedGroup ? 'Time Spent (Hours)' : 'New Students',
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            selectedGroup
              ? `${context.parsed.y.toFixed(2)} Hours`
              : `${context.parsed.y} Students`,
        },
      },
    },
  };

  // Test Performance Bar Chart
const testPerformanceData = {
 labels: selectedGroup
  ? (data.modulePassingRates || []).map((m) => m.module)
  : (data.averagePassedStudents || []).map((item) => item.title || 'N/A'),
datasets: [
  {
    label: selectedGroup ? 'Module Passing Rate (%)' : 'Avg Passing Rate (%)',
    data: selectedGroup
      ? (data.modulePassingRates || []).map((m) => m.passingRate)
      : (data.averagePassedStudents || []).map(
          (item) => (item.avg_passed_students_per_exam || 0) * 100
        ),
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

  const testPerformanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y.toFixed(1)}% Passing Rate`,
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
          data.pieChart?.issuedCertificates || 0,
          data.pieChart?.pendingCertificates || 0,
        ],
        backgroundColor: ['#10B981', '#F87171'],
      },
    ],
  };

  return (
    <Box className="p-[2vw] bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header Row */}
      <Group position="apart" className="mb-4" style={{ alignItems: 'center' }}>
        <BreadCrumbs />
        <FormControl size="small" sx={{ minWidth: 200, marginRight: 2 }}>
          <InputLabel>Group*</InputLabel>
          <Select
            value={selectedGroup}
            onChange={(e) => {
    const selectedId = e.target.value;
    setSelectedGroup(selectedId);

    // Find the selected group object
    const selected = groups.find((g) => g.id === selectedId);
    setGroupName(selected ? selected.title : '');
    
    console.log('Selected group ID:', selectedId);
    console.log('Selected group name:', selected ? selected.title : '');
  }}
            label="Group*"
          >
            <MenuItem value="">All Groups</MenuItem>
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ExportToExcelButton data={data}
  selectedGroup={selectedGroup}
  groups={groups}
  groupName={groupName} />
      </Group>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((s, i) => (
          <Grid item key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              onClick={s.onClick}
              sx={{
                p: 6,
                borderRadius: '20px',
                boxShadow: 3,
                background: `linear-gradient(to right, ${s.color[0]}, ${s.color[1]})`,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 160,
                transition: 'all 0.3s ease',
                cursor: s.onClick ? 'pointer' : 'default',
                '&:hover': s.onClick && {
                  boxShadow: 6,
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

      {/* Charts Section */}
      <Grid container spacing={3}>
        {data.curveChart?.length > 0 && (
          <Grid item size={{ xs: 12, md: 8 }}>
            <Paper className="p-4 rounded-2xl shadow-md bg-white">
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                📈{' '}
                {selectedGroup ? 'Section-wise Time Spent' : 'Student Growth'}
              </Typography>
              <Box sx={{ height: 280 }}>
                <Line data={studentGrowthData} options={studentGrowthOptions} />
              </Box>
            </Paper>
          </Grid>
        )}

        <Grid item size={{ xs: 12, md: 4 }}>
          <Paper className="p-4 rounded-2xl shadow-md bg-white">
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              🏆 Certificates Status
            </Typography>
            <Box sx={{ height: 280 }}>
              <Pie
                data={certificatePieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <Paper className="p-4 rounded-2xl shadow-md bg-white">
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              📊 Test Performance
            </Typography>
            <Box sx={{ height: 280 }}>
              <Bar
                data={testPerformanceData}
                options={testPerformanceOptions}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
