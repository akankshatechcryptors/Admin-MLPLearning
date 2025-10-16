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
  const [state,setState]=useState(null)
  const [dist,setDist]=useState(null)
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    type: '',
    contact: '',
    group_id: groupId || '',
    state:state,
    district:dist
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setTab(0); // force single user form in edit mode
    } else {
      setFormData({ fullname: '', email: '', password: '', type: '', contact: '', group_id: groupId || '' ,state:"",district:""});
    }
  }, [initialData, groupId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
console.log("hii" ,formData)
  const handleSingleSubmit = () => {
    if (!formData.fullname || !formData.email || !formData.type || !formData.contact) {
      alert('Please fill all required fields');
      return;
    }
    onSaveSingle?.(formData);
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
            <TextField
              select
              label="Speciality"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              fullWidth
            >
              {/* <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="physician">Physician</MenuItem>
              <MenuItem value="marketeer">Marketeer</MenuItem>
              <MenuItem value="others">Others</MenuItem> */}
                 <MenuItem value="allergy">Allergy</MenuItem>
                <MenuItem value="alternative-complementary-medicine">Alternative / Complementary Medicine</MenuItem>
                <MenuItem value="anesthesiology">Anesthesiology</MenuItem>
                <MenuItem value="cardiology">Cardiology</MenuItem>
                <MenuItem value="critical-care-and-intensive-care">Critical Care and Intensive Care</MenuItem>
                <MenuItem value="cytology">Cytology</MenuItem>
                <MenuItem value="dentistry">Dentistry</MenuItem>
                <MenuItem value="dermatology">Dermatology</MenuItem>
                <MenuItem value="diabetes-mellitus-diabetes-insipidus">Diabetes Mellitus / Diabetes Insipidus</MenuItem>
                <MenuItem value="endocrinology">Endocrinology</MenuItem>
                <MenuItem value="forensic-medicine">Forensic Medicine</MenuItem>
                <MenuItem value="gastroenterology">Gastroenterology</MenuItem>
                <MenuItem value="gerontology-geriatrics">Gerontology / Geriatrics</MenuItem>
                <MenuItem value="hematology">Hematology</MenuItem>
                <MenuItem value="immunology-serology">Immunology & Serology</MenuItem>
                <MenuItem value="infectious-disease">Infectious Disease</MenuItem>
                <MenuItem value="internal-medicine">Internal Medicine</MenuItem>
                <MenuItem value="laboratory-medicine">Laboratory Medicine</MenuItem>
                <MenuItem value="metabolism">Metabolism</MenuItem>
                <MenuItem value="microbiology">Microbiology</MenuItem>
                <MenuItem value="neonatology">Neonatology</MenuItem>
                <MenuItem value="nephrology">Nephrology</MenuItem>
                <MenuItem value="neurology">Neurology</MenuItem>
                <MenuItem value="nutrition">Nutrition</MenuItem>
                <MenuItem value="obstetrics-gynecology">Obstetrics & Gynecology</MenuItem>
                <MenuItem value="oncology">Oncology</MenuItem>
                <MenuItem value="ophthalmology">Ophthalmology</MenuItem>
                <MenuItem value="orthopedics">Orthopedics</MenuItem>
                <MenuItem value="otorhinolaryngology">Otorhinolaryngology</MenuItem>
                <MenuItem value="pain-management">Pain Management</MenuItem>
                <MenuItem value="patient-education">Patient Education</MenuItem>
                <MenuItem value="pediatrics">Pediatrics</MenuItem>
                <MenuItem value="pharmacology">Pharmacology</MenuItem>
                <MenuItem value="physical-medicine-rehab">Physical Medicine & Rehab</MenuItem>
                <MenuItem value="podiatry">Podiatry</MenuItem>
                <MenuItem value="practice-management">Practice Management</MenuItem>
                <MenuItem value="primary-care">Primary Care</MenuItem>
                <MenuItem value="psychiatry">Psychiatry</MenuItem>
                <MenuItem value="radiology">Radiology</MenuItem>
                <MenuItem value="respiratory-medicine">Respiratory Medicine</MenuItem>
                <MenuItem value="rheumatology">Rheumatology</MenuItem>
                <MenuItem value="sports-medicine">Sports Medicine</MenuItem>
                <MenuItem value="surgery">Surgery</MenuItem>
                <MenuItem value="tropical-medicine">Tropical Medicine</MenuItem>
                <MenuItem value="urology">Urology</MenuItem>
                <MenuItem value="virology">Virology</MenuItem>
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
