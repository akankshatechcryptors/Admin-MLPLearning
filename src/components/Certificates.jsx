import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip, Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { getUsers, imgUrl } from '../common/api';
import Breadcrumbs from './BreadCrumb';
import { encryptFilename } from '../common/pdfCrypt';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Certificates = () => {
  const [users, setUsers] = useState([]);
  const [openPdf, setOpenPdf] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await getUsers({ group_id: '' });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenPdf = (url) => {
    // Add toolbar=0 to disable PDF toolbar
    const pdfUrl = `${url}#toolbar=0`;
    setSelectedPdf(pdfUrl);
    setOpenPdf(true);
  };

  const handleClosePdf = () => {
    setOpenPdf(false);
    setSelectedPdf('');
  };

  return (
    <Box className="p-[2vw] bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Box className="mb-4 flex justify-between items-center">
        <Breadcrumbs />
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((userObj) =>
          userObj.groups
            ?.filter((exam) => exam.status === 'pass') // Only passed exams
            .map((exam) => {
              const encryptedName = encryptFilename(`${userObj.id}_${exam.exam_id}`);
              const certificateUrl = `${imgUrl}/uploads/certificates/${encryptedName}.pdf`;

              return (
                <motion.div
                  key={`${userObj.id}_${exam.exam_id}`}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-lg p-4 shadow-md bg-blue-100 flex flex-col justify-between"
                >
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      {userObj.fullname}
                    </Typography>
                    <Typography variant="body2" className="text-gray-700">
                      {exam.title}
                    </Typography>
                  </div>
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Tooltip title="View Certificate">
                      <IconButton onClick={() => handleOpenPdf(certificateUrl)} color="primary">
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </motion.div>
              );
            })
        )}
      </Box>

      {/* PDF Modal using iframe */}
      <Dialog open={openPdf} onClose={handleClosePdf} maxWidth="lg" height="20vw" fullWidth>
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
