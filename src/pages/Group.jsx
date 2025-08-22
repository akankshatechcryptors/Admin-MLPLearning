import React, { useState } from 'react';
import Breadcrumbs from '../components/BreadCrumb';
import GroupDetails from '../components/GroupDetails';
import { Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from 'react-router-dom';
import UploadUsersModal from '../components/UploadUser';
import { encryptPassword } from "../common/crypt";
import { addUser } from '../common/api';
const Groups = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [uploadedUsers, setUploadedUsers] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null); // {type, user, group}
  const location = useLocation();
  const { state } = location;
  const groupName = state?.title || ""; // empty means "All Users"
  const groupId=state?.id||''
  const handleAddClick = () => {
    setEditUser(null);
    setOpenModal(true);
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setOpenModal(true);
  };

  const handleSaveUser = async(userData) => {
  try {
      if (userData.password) {
    userData.password = encryptPassword(userData.password);
  }
  const res = await addUser(userData); // wait for the promise
  console.log(res)
} catch (err) {
  console.error("Error while adding user" ,err)
    setOpenModal(false);
  };
}

  const handleUploadUsers = (usersData) => {
    console.log('Uploaded users:', usersData);
    setUploadedUsers(usersData);
  };

  const handleDelete = (user, type, group = null) => {
    setConfirmAction({ type, user, group });
  };

  const confirmDelete = () => {
    if (confirmAction?.type === "deleteUser") {
      console.log("Deleting user permanently:", confirmAction.user);
    } else if (confirmAction?.type === "removeFromGroup") {
      console.log(`Removing ${confirmAction.user.name} from group ${confirmAction.group}`);
    }
    setConfirmAction(null);
  };

  const cancelDelete = () => setConfirmAction(null);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Box className="flex justify-between items-center mb-6">
        <Breadcrumbs />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          {groupName || "All Users"}
        </Typography>
        <Box className="flex gap-4">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{ borderRadius: '50px' }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <GroupDetails
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        uploadedUsers={uploadedUsers}
        groupName={groupName}
        groupId={groupId}
        onDelete={handleDelete}
      />

      {/* Add / Upload Modal */}
      <UploadUsersModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        initialData={editUser}
        groupId={groupId}
        onSaveSingle={handleSaveUser}
        onUploadBulk={handleUploadUsers}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={!!confirmAction} onClose={cancelDelete}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          Are you sure you want to{" "}
          {confirmAction?.type === "deleteUser"
            ? "delete this user permanently?"
            : `remove ${confirmAction?.user?.name} from ${confirmAction?.group}?`}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Groups;
