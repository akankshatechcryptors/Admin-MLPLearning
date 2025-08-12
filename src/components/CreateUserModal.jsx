import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';

const UserModal = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: '',
    contact: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        type: '',
        contact: '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.type || !formData.contact) {
      alert('Please fill all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Edit User' : 'Add New User'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Full Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          fullWidth
        />
        <TextField
          label="Email ID"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Speciality"
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          fullWidth
        >
          <MenuItem value="Cardiology">Cardiology</MenuItem>
          <MenuItem value="Neurology">Neurology</MenuItem>
          <MenuItem value="Oncology">Oncology</MenuItem>
          <MenuItem value="Dermatology">Dermatology</MenuItem>
          <MenuItem value="Endocrinology">Endocrinology</MenuItem>
        </TextField>
        <TextField
          label="Contact"
          value={formData.contact}
          onChange={(e) => handleChange('contact', e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
