import { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom';
import AuthContext from './common/AuthContext';
import Login from './pages/Login';
import ProtectedWrapper from './common/ProtectedWrapper';
import Layout from './components/Layout';
import Home from './pages/Home';
import Users from './pages/Users'
import Test from './pages/Test'
import Group from './pages/Group'
import TestSummary from './pages/TestSummary'
import Admin from './pages/Admins'
import TestList  from './components/TestCards'
import TestQuestions from './pages/TestQuestions'
import AdminDashboard from './pages/Dashboard';
import Certificates from './components/Certificates';
import { motion } from 'framer-motion';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [type,setType]=useState('')
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true); // ⏳ Important!
   const [isDesktop, setIsDesktop] = useState(true);
 useEffect(() => {
    const checkScreen = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      if (window.innerWidth < 1024 && !isLandscape) {
        setIsDesktop(false);
      } else {
        setIsDesktop(true);
      }
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

 
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setEmail(user.email);
      setName(user.name);
      setIsLoggedIn(true);
      setUser(user.id);
      setType(user.type);
      setToken(user.token);
    }
    setLoading(false); // ✅ Finish loading after checking localStorage
  }, []);

  const signin = (newUser, callback) => {
    //console.log(newUser)
    if (newUser && newUser.fullname) {
      localStorage.setItem('user', JSON.stringify(newUser));
      setEmail(newUser.email);
      setName(newUser.fullname);
      setType(newUser.type);
      setIsLoggedIn(true);
      setUser(newUser.id);
      setToken(newUser.token);
      if (callback) callback();
    }
  };

  const signout = () => {
    localStorage.removeItem('user');
    localStorage.clear()
    setEmail('');
    setUser('');
    setName('');
    setType('')
    setIsLoggedIn(false);
  };

  const value = { email, user, isLoggedIn, token,type, signin, signout };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedWrapper>
              <Layout />
            </ProtectedWrapper>
          }
        >
          <Route index element={<Home />} />
          <Route path='dashboard' element={<AdminDashboard/>}/>
          <Route path="groups" element={<Users />} />
          <Route path="tests" element={<Test/>} />
          <Route path="tests/:folderName" element={<TestList/>}/>
          <Route path="users" element={<Group/>}/>
          <Route path="summary" element={<TestSummary/>}/>
          <Route path="admins" element={<Admin/>}/>
          <Route path="add-questions" element={<TestQuestions/>}/>
          <Route path='certificates' element={<Certificates/>}/>
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    )
  );

  // ⏳ Don't render anything until we know the login state
  if (loading) return <div>Loading...</div>;
//  if (!isDesktop) {
//     return (
//       <div className="w-full min-h-screen flex items-center justify-center px-4 bg-gray-100">
//         <motion.div
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: 'easeOut' }}
//           className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md"
//         >
//           <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//             Access Restricted
//           </h2>
//           <p className="text-gray-600 mb-4">
//             For the best experience, please access this platform on a desktop device.  
//             This interface is optimized for larger screens.
//           </p>
//           <p className="text-gray-500 text-sm">
//             If you are in landscape mode on a tablet, you may continue using it.
//           </p>
//         </motion.div>
//       </div>
//     );
//   }

  return (
    <AuthContext.Provider value={value}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
