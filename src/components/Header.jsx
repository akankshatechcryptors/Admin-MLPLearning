import React, { useState, useContext } from 'react';
import {
  Menu,
  MenuItem,
  IconButton,
  InputBase,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment
} from '@mui/material';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import AuthContext from '../common/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [searchText, setSearchText] = useState('');

  const open = Boolean(anchorEl);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // Get username from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.name || 'User';

  const handleLogout = () => {
    auth.signout(() => {
      setAnchorEl(null);
      navigate('/login');
    });
  };

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      alert('Please fill both fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // API call for password change can go here
    console.log('Password changed to:', newPassword);

    setPasswordModalOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    setAnchorEl(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
      setSearchText('');
    }
  };

  return (
    <>
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center overflow-hidden">
        {/* Title clickable to home */}
        <Typography
          variant="h5"
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          MLP Learning
        </Typography>

        {/* Search bar */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-full max-w-xl"
        >
          <SearchIcon className="text-gray-500" />
          <InputBase
            placeholder="Search…"
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Box>

        {/* Username + Avatar */}
        <Box className="flex items-center gap-2">
          <Typography variant="body1">{username}</Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AccountCircle fontSize="large" className="text-blue-600" />
          </IconButton>
        </Box>

        {/* Menu */}
        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <MenuItem
            onClick={() => {
              setPasswordModalOpen(true);
              setAnchorEl(null);
            }}
          >
            Change Password
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </header>

      {/* Change Password Modal */}
      <Dialog open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 400 }}>
          <TextField
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} variant="contained">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
