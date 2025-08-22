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
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true); // ⏳ Important!

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setEmail(user.email);
      setName(user.name);
      setIsLoggedIn(true);
      setUser(user.id);
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
      setIsLoggedIn(true);
      setUser(newUser.id);
      setToken(newUser.token);
      if (callback) callback();
    }
  };

  const signout = () => {
    localStorage.removeItem('user');
    setEmail('');
    setUser('');
    setName('');
    setIsLoggedIn(false);
  };

  const value = { email, user, isLoggedIn, token, signin, signout };

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
          <Route path="groups" element={<Users />} />
          <Route path="tests" element={<Test/>} />
          <Route path="tests/:folderName" element={<TestList/>}/>
          <Route path="users" element={<Group/>}/>
          <Route path="summary" element={<TestSummary/>}/>
          <Route path="admins" element={<Admin/>}/>
          <Route path="add-questions" element={<TestQuestions/>}/>
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    )
  );

  // ⏳ Don't render anything until we know the login state
  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={value}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
