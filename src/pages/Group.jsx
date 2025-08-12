import React, { useState } from 'react';
import Breadcrumbs from '../components/BreadCrumb';
import GroupDetails from '../components/GroupDetails';
import { Button, Box,Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import UploadUsersModal from '../components/UploadUser';

const Groups = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [uploadedUsers, setUploadedUsers] = useState([]);
   const location = useLocation();
  const { state } = location;
 const groupName = state?.title || 'Neurology';
  const handleAddClick = () => {
    setEditUser(null);
    setOpenModal(true);
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setOpenModal(true);
  };

  const handleSaveUser = (userData) => {
    console.log('Saved user:', userData);
    setOpenModal(false);
  };

  const handleUploadUsers = (usersData) => {
    console.log('Uploaded users:', usersData);
    setUploadedUsers(usersData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Box className="flex justify-between items-center mb-6">
        <Breadcrumbs />
<Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: 'text.primary',
          textAlign: 'center',
          marginBottom: 2,
        }}
      >
       {groupName}
      </Typography>
        <Box className="flex gap-4">
        
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              borderRadius: '50px',
            }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <GroupDetails
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        uploadedUsers={uploadedUsers}
      />

      {/* New Add / Upload Modal */}
      <UploadUsersModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        initialData={editUser}
        onSaveSingle={handleSaveUser} // ✅ correct prop
        onUploadBulk={handleUploadUsers} // ✅ correct prop
      />
    </div>
  );
};

export default Groups;
