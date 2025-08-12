import React from 'react';
import DashboardCard from '../components/DashboardCards';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
const Home = () => {
  const cards = [
    {
      title: 'Dashboard',
      subtitle: 'View comprehensive test analytics',
      icon: <DashboardIcon />,
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      path: '/',
    },
    {
      title: 'Users',
      subtitle: 'Manage doctors and Groups',
      icon: <GroupIcon />,
      bgColor: 'bg-gradient-to-br from-teal-50 to-teal-100',
      path: '/groups',
    },
    {
      title: 'Tests',
      subtitle: 'Administer and review assessments',
      icon: <AssignmentIcon />,
      bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      path: '/tests',
    },
    {
      title: 'Test Summary',
      subtitle: 'Detailed exam performance insights',
      icon: <BarChartIcon />,
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
      path: '/summary',
    },
     {
      title: 'Admins',
      subtitle: 'Manage admin accounts and permissions',
      icon: <AdminPanelSettingsIcon />,
      bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
      path: '/admins',
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Doctor Certification Portal</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <DashboardCard key={i} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Home;