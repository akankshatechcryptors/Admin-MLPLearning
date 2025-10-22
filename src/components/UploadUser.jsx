import React, { useState, useEffect } from 'react';
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
import State from '../common/State'
import District from '../common/District'
import SpecialityDropdown from './SpecialityDropdown';
const AddOrUploadUserModal = ({
  open,
  onClose,
  onSaveSingle,
  groupId,
  onUploadBulk,
  initialData
}) => {
  const isEditMode = Boolean(initialData);
  const [tab, setTab] = useState(0);
  const [state,setState]=useState(null);
  const [dist,setDist]=useState(null);
  const [type,setType]=useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    type: type,
    contact: '',
    group_id: groupId || '',
    state:state,
    district:dist
  });

  //console.log("formdata: ",formData);
  
  useEffect(() => {
    if (initialData) {
      //console.log('initial data for s/d: ',initialData);
      setFormData(initialData);
      setState(initialData.state);
      setDist(initialData.district);
      setType(initialData.type);
      setTab(0); 
      
      // force single user form in edit mode
    } else {
      setFormData({ fullname: '', email: '', password: '', contact: '', group_id: groupId || ''})
      setState('')
      setDist('');
      setType('');
    }
  }, [initialData, groupId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
//console.log("hii" ,formData)
//console.log({formData,state:state,district:dist,type:type});
  const handleSingleSubmit = () => {
    if (!formData.fullname || !formData.email || !type || !formData.contact) {
      alert('Please fill all required fields');
      return;
    }
    onSaveSingle?.({formData,state:state,district:dist,type:type});
    onClose();
  };

const onDrop = (acceptedFiles) => {
  if (acceptedFiles.length > 0) {
    onUploadBulk?.(acceptedFiles[0]); // trigger bulk upload
    // don't call onClose() here
  }
};
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

      {!isEditMode && (
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
          <Tab label="Single User" />
          <Tab label="Bulk Upload" />
        </Tabs>
      )}

      <DialogContent>
        {(tab === 0 || isEditMode) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Full Name"
              value={formData.fullname}
              onChange={(e) => handleChange('fullname', e.target.value)}
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
            <State value={state} handleChange={(e)=>setState(e.target.value)}/>
            <District selectedState={state} handleChange={e=>setDist(e.target.value)} value={dist}/>

            <SpecialityDropdown value={type} handleChange={(e)=>setType(e.target.value)} /> 
            <TextField
              label="Contact"
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              fullWidth
            />
          </Box>
        )}

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
                <a href="/sample-users.xlsx" download style={{ textDecoration: 'underline', color: '#1976d2' }}>
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
