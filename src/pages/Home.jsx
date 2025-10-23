import React, { useContext } from 'react';
import DashboardCard from '../components/DashboardCards';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import SchoolIcon from '@mui/icons-material/School';
import AuthContext from '../common/AuthContext';

const Home = () => {
  const auth = useContext(AuthContext);

  // Base cards visible to all except observer (later filtered)
  const baseCards = [
    {
      title: 'Dashboard',
      subtitle: 'View real-time test analytics and performance metrics',
      icon: <DashboardIcon />,
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
      path: '/dashboard',
    },
    {
      title: 'Test Summary',
      subtitle: 'Analyze detailed reports of exams and user performance',
      icon: <BarChartIcon />,
      bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
      path: '/summary',
    },
    // {
    //   title: 'Tests',
    //   subtitle: 'Create, assign, and manage certification assessments',
    //   icon: <AssignmentIcon />,
    //   bgColor: 'bg-gradient-to-br from-indigo-100 to-indigo-200',
    //   path: '/tests',
    // },
  ];

  // Extra cards for superadmins only
  const superAdminCards = [
    {
      title: 'Users',
      subtitle: 'Manage doctors, observers, and group participants',
      icon: <VerifiedUserRoundedIcon />,
      bgColor: 'bg-gradient-to-br from-amber-100 to-amber-200',
      path: '/users',
    },
    {
      title: 'Admins',
      subtitle: 'Manage admin accounts, roles, and permissions',
      icon: <AdminPanelSettingsIcon />,
      bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200',
      path: '/admins',
    },
    {
      title: 'CME / CPD Programs',
      subtitle: 'Organize and manage continuing education groups',
      icon: <SchoolIcon />,
      bgColor: 'bg-gradient-to-br from-sky-100 to-sky-200',
      path: '/groups',
    },
  ];

  // Role-based logic
  let cards = [];

  if (auth?.type === 'superadmin') {
    cards = [...baseCards, ...superAdminCards];
  } else if (auth?.type === 'observer') {
    // observer can only see dashboard & test summary
    cards = baseCards.filter(
      (card) => card.title === 'Dashboard' || card.title === 'Test Summary'
    );
  } else {
    // for other roles like admin or doctor
    cards = baseCards;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Doctor Certification Portal
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {cards.map((card, i) => (
          <DashboardCard key={i} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Home;
