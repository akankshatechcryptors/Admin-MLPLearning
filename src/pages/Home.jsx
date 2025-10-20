import React, { useContext } from 'react';
import DashboardCard from '../components/DashboardCards';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import User from '@mui/icons-material/VerifiedUserRounded';
import AuthContext from '../common/AuthContext';

const Home = () => {
  const auth = useContext(AuthContext);

  const baseCards = [
    {
      title: 'Dashboard',
      subtitle: 'View comprehensive test analytics',
      icon: <DashboardIcon />,
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
      path: '/dashboard',
    },
     {
      title: 'Test Summary',
      subtitle: 'Detailed exam performance insights',
      icon: <BarChartIcon />,
      bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
      path: '/summary',
    },
    // {
    //   title: 'Tests',
    //   subtitle: 'Administer and review assessments',
    //   icon: <AssignmentIcon />,
    //   bgColor: 'bg-gradient-to-br from-indigo-100 to-indigo-200',
    //   path: '/tests',
    // },
   
  ];

  const superAdminCards = [
    {
      title: 'Users',
      subtitle: 'Manage doctors and Groups',
      icon: <User />,
      bgColor: 'bg-gradient-to-br from-amber-100 to-amber-200',
      path: '/users',
    },
    {
      title: 'Admins',
      subtitle: 'Manage admin accounts and permissions',
      icon: <AdminPanelSettingsIcon />,
      bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200',
      path: '/admins',
    },
    {
      title: 'Groups',
      subtitle: 'Manage Groups',
      icon: <GroupIcon />,
      bgColor: 'bg-gradient-to-br from-sky-100 to-sky-200',
      path: '/groups',
    },
  ];

  // Merge depending on role
  const cards =
    auth?.type === 'superadmin' ? [...baseCards, ...superAdminCards] : baseCards;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Doctor Certification Portal
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 xs:grid-col-1 justify-items-center">
        {cards.map((card, i) => (
          <DashboardCard key={i} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Home;
