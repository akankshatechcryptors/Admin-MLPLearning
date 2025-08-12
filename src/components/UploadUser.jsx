import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Box,
  Typography
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';

const AddOrUploadUserModal = ({
  open,
  onClose,
  onSaveSingle,
  onUploadBulk,
  initialData
}) => {
  const isEditMode = Boolean(initialData);
  const [tab, setTab] = useState(0); // always 0 in edit mode
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
      console.log(initialData)
      setTab(0); // ensure single user form
    } else {
      setFormData({ name: '', email: '', password: '', type: '', contact: '' });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSingleSubmit = () => {
    if (!formData.name || !formData.email || !formData.type || !formData.contact) {
      alert('Please fill all required fields');
      return;
    }
    if (onSaveSingle) {
      onSaveSingle(formData);
    }
    onClose();
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        if (onUploadBulk) {
          onUploadBulk(jsonData);
        }
        onClose();
      };
      reader.readAsArrayBuffer(file);
    }
  }, [onClose, onUploadBulk]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? 'Edit User' : 'Add User(s)'}</DialogTitle>

      {/* Tabs only if not editing */}
      {!isEditMode && (
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
          <Tab label="Single User" />
          <Tab label="Bulk Upload" />
        </Tabs>
      )}

      <DialogContent>
        {/* Always show single-user form in edit mode */}
        {(tab === 0 || isEditMode) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
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
            {!isEditMode && (
              <TextField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                fullWidth
              />
            )}
            <TextField
              select
              label="Type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              fullWidth
            >
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="physician">Physician</MenuItem>
              <MenuItem value="marketeer">Marketeer</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </TextField>
            <TextField
              label="Contact"
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              fullWidth
            />
          </Box>
        )}

        {/* Bulk upload tab only when adding */}
        {!isEditMode && tab === 1 && (
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #aaa',
              borderRadius: 2,
              padding: 4,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? '#f0f8ff' : 'transparent',
              mt: 2
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2' }} />
            <Typography variant="h6" mt={2}>
              {isDragActive
                ? 'Drop the file here...'
                : 'Drag & drop file here, or click to select'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Supported formats: .xlsx, .xls
            </Typography>
            <Box mt={2}>
              <Typography variant="body2">
                Need a template?{' '}
                <a
                  href="/assets/sample-users.xlsx"
                  download
                  style={{ textDecoration: 'underline', color: '#1976d2' }}
                >
                  Download sample users file
                </a>
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSingleSubmit} variant="contained">
          {isEditMode ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrUploadUserModal;
