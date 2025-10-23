import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { getUsers, imgUrl, downloadCertificate } from '../common/api';
import Breadcrumbs from './BreadCrumb';
import { encryptFilename } from '../common/pdfCrypt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import State from '../common/State';
import District from '../common/District';

const Certificates = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState('');
  const [dist, setDist] = useState('');
  const location = useLocation();
  const group_id = location?.state?.group_id || '';
  const [openPdf, setOpenPdf] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await getUsers({ group_id });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [group_id]);

  const handleOpenPdf = (url) => {
    const pdfUrl = `${url}#toolbar=0`;
    setSelectedPdf(pdfUrl);
    setOpenPdf(true);
  };

  const handleClosePdf = () => {
    setOpenPdf(false);
    setSelectedPdf('');
  };

  const handleDownloadCertificate = async () => {
    if (!group_id) return;
    setDisabling(true);
    try {
      const res = await downloadCertificate({ group_id });
      const blob = new Blob([res.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificates_${group_id}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificates:', error);
    } finally {
      setDisabling(false);
    }
  };

  // Process & filter users
  const filteredUsers = users
    .map((user) => ({
      ...user,
      passedExams: user.groups?.filter((exam) => exam.status === 'pass') || [],
    }))
    .filter((user) => {
      const matchName = user.fullname.toLowerCase().includes(searchTerm.toLowerCase());
      const matchState = state ? user.state === state : true;
      const matchDistrict = dist ? user.district === dist : true;
      return matchName && matchState && matchDistrict;
    });

  const totalCertificates = filteredUsers.reduce(
    (acc, user) => acc + user.passedExams.length,
    0
  );

  return (
    <Box className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Breadcrumb & Download */}
      <Box className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <Breadcrumbs />
        {group_id && (
          <Button
            size="medium"
            disabled={disabling}
            onClick={handleDownloadCertificate}
            variant="contained"
            color="primary"
          >
            Download Certificates
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Box className="mb-4">
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
           <Grid item  size={{xs:12,sm:4,md:3}}>
            <Typography variant="subtitle1" fontWeight="bold">
              Total Certificates: {totalCertificates}
            </Typography>
          </Grid>
          <Grid
            item
            size={{xs:12,sm:8,md:9}}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            gap={1}
          >

             <TextField
             fullWidth
              variant="outlined"
              label="Search Users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                borderRadius: '50px',
                '& .MuiOutlinedInput-root': {
                  padding: '0px',
                },
              }}
            />
            <State
              value={state}
              handleChange={(e) => {
                setState(e.target.value);
                setDist('');
              }}
            />
            <District
              selectedState={state}
              handleChange={(e) => setDist(e.target.value)}
              value={dist}
            />
           
          </Grid>
        </Grid>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} className="overflow-x-auto">
        <Table sx={{ minWidth: 650 }} aria-label="certificate table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
              <TableCell><Typography fontWeight="bold">S.No</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">User Name</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">State</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">District</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Exam Title</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
            {filteredUsers.map((user, userIndex) =>
              user.passedExams.map((exam, examIndex) => {
                const encryptedName = encryptFilename(`${user.id}_${exam.exam_id}`);
                const certificateUrl = `${imgUrl}/uploads/certificates/${encryptedName}.pdf`;
                const serialNumber =
                  filteredUsers
                    .slice(0, userIndex)
                    .reduce((acc, u) => acc + u.passedExams.length, 0) + examIndex + 1;

                return (
                  <TableRow
                    key={`${user.id}_${exam.exam_id}`}
                    component={motion.tr}
                    whileHover={{ scale: 1.02 }}
                  >
                    <TableCell>{serialNumber}</TableCell>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.state || '-'}</TableCell>
                    <TableCell>{user.district || '-'}</TableCell>
                    <TableCell>{exam.title}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Certificate">
                        <IconButton
                          onClick={() => handleOpenPdf(certificateUrl)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PDF Viewer */}
      <Dialog open={openPdf} onClose={handleClosePdf} maxWidth="lg" fullWidth>
        <DialogContent style={{ padding: 0 }}>
          {selectedPdf && (
            <iframe
              src={selectedPdf}
              title="Certificate PDF"
              width="100%"
              height="800px"
              style={{ border: 'none' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePdf} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Certificates;
