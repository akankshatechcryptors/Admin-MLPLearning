import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Link,
  InputAdornment,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { encryptPassword } from "../common/crypt"; // 🔑 encryption util
import Doctor from '../assets/doctor.jpg';
import users from '../common/data/user.json'; // Make sure path is correct
import AuthContext from '../common/AuthContext'; // ✅ Import context
import { login } from '../common/api';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = useContext(AuthContext); // ✅ Use context

const handleLogin = async (e) => {
  e.preventDefault();

  // 🔐 Encrypt the password entered by user
  const encryptedPassword = encryptPassword(password);
  console.log(password)
  console.log(encryptedPassword)
  const data = {
    email: email,
    password: encryptedPassword,
  };

  try {
    const res = await login(data);
    const user = res.data;
    if (user.error) {
      // ❌ Show error from backend
      toast.error(user.message || "Login failed", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      // ✅ Success login
      auth.signin(user.admin, () => {
        toast.success(user.message || "👨‍⚕️ Welcome Admin", {
          position: "top-right",
          autoClose: 2000,
          style: { background: "#1565a0", color: "white" },
        });
        navigate("/", { replace: true });
      });
    }
  } catch (err) {
    console.error("Error while logging in", err);
    toast.error("Something went wrong. Please try again.", {
      position: "top-right",
      autoClose: 2000,
    });
  }
};

  return (
  <>
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#e8f5e9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: 4,
      width: '70%',       // changed from 100% maxWidth
    maxWidth: '70%',    // optional, you can remove if you want full width
    minHeight: '60vh',  // optional: keep it tall on bigger screens
        }}
      >
        <Box sx={{ flex: 1, padding: { xs: 4, md: 6 } }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: '#1565c0', marginBottom: 4 }}
          >
            Welcome Admin
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email ID"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.2, borderRadius: 10, fontWeight: 'bold' }}
            >
              Login
            </Button>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: 2,
              }}
            >
              <Link
                href="#"
                underline="hover"
                sx={{ fontSize: 14, color: '#1565c0' }}
              >
                Forgot password?
              </Link>
            </Box>
          </form>
        </Box>

        {/* Right Image Section */}
        <div style={{ flex: 1 }}>
          <img
            src={Doctor}
            alt="Doctor Illustration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      </Paper>
    </Box>
    <div className='py-1'>
        <footer className="text-center font-semibold">
          Copyright © MIND&apos;s Lab Publishing 2025. All rights reserved.</footer>
      </div>
  </>
  );
};

export default Login;
