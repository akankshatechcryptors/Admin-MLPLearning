import React, { useState } from 'react';
import Breadcrumbs from '../components/BreadCrumb';
import GroupDetails from '../components/GroupDetails';
import { Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from 'react-router-dom';
import UploadUsersModal from '../components/UploadUser';
import { encryptPassword } from "../common/crypt";
import { addUser, uploadUsers, editUser } from '../common/api';
import {toast} from  'react-toastify'

const Groups = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // renamed to avoid conflict
  const [uploadedUsers, setUploadedUsers] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null); // {type, user, group}
  const[update,setUpdate]=useState(false)

  const location = useLocation();
  const { state } = location;
  const groupName = state?.title || ""; // empty means "All Users"
  const groupId = state?.id || '';
 const handleUpdate=()=>{
  setUpdate(!update)
 }
  const handleAddClick = () => {
    setEditingUser(null);
    setOpenModal(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setOpenModal(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (userData.password) {
        userData.password = encryptPassword(userData.password);
      }

      let res;
      if (editingUser) {
        const data={
          id:editingUser.id,
          fullname:userData.fullname,
          email:userData.email,
          type:userData.type,
          password:userData.password||'',
          contact:userData.contact
        }
        //console.log(data)
        // 📝 Editing existing user
        res = await editUser(data);
        //console.log(res.data.error)
        if(!res.data.error){
          toast.success(res.data.message)
        }
        
        else{
          toast.error(res.data.message)
        }
      } else {
        // ➕ Adding new user
        res = await addUser(userData);
        //console.log("User added:", res);
         if(!res.data.error){
          toast.success(res.data.message)
          handleUpdate()
        }
        else{
          toast.error(res.data.message)
        }
      }

      setOpenModal(false);
    } catch (err) {
      console.error("Error while saving user", err);
      setOpenModal(false);
    }
  };

  const handleUploadUsers = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (groupId) formData.append('group_id', groupId);

      const res = await uploadUsers(formData);
      //console.log("Uploaded users response:", res);
      setOpenModal(false);
    } catch (err) {
      console.error("Error uploading users", err);
      setOpenModal(false);
    }
  };

  const handleDelete = (user, type, group = null) => {
    setConfirmAction({ type, user, group });
  };

  const confirmDelete = () => {
    if (confirmAction?.type === "deleteUser") {
      //console.log("Deleting user permanently:", confirmAction.user);
    } else if (confirmAction?.type === "removeFromGroup") {
      //console.log(`Removing ${confirmAction.user.name} from group ${confirmAction.group}`);
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
        initialData={editingUser}
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
