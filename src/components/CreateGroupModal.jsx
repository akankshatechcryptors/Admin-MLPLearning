import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  InputLabel,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CreateGroupModal = ({ open, onClose, onSubmit, initialData }) => {
  const [groupName, setGroupName] = useState('');
  const [userLimit, setUserLimit] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  // Fill form if editing
  useEffect(() => {
    if (initialData) {
      setGroupName(initialData.title || '');
      setUserLimit(initialData.registration_limit || '');
      setStartDate(initialData.start_date || '');
      setEndDate(initialData.end_date || '');
    } else {
      setGroupName('');
      setUserLimit('');
      setStartDate('');
      setEndDate('');
    }
  }, [initialData]);

  //console.log('initial data: ',initialData)

  const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

  const handleSubmit = () => {
    if (!groupName) {
      toast.error("Please enter group name");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date cannot be earlier than start date");
      return;
    }
    const today = new Date();
today.setHours(0, 0, 0, 0);

const selected = new Date(startDate);
selected.setHours(0, 0, 0, 0);

if (selected < today) {
  toast.error("Start date cannot be in the past");
  return;
}


   // console.log('start date: ',new Date(startDate));
    //console.log('current date: ', Date.now());

    onSubmit({
      title: groupName,
      registration_limit: userLimit,
      start_date:startDate,
      end_date:endDate,
      count: initialData?.count || 0,
      id: initialData?.id,
    });

    toast.success(
      initialData ? "Group updated successfully!" : "Group created successfully!",
      {
        position: "top-right",
        autoClose: 2000,
        onClose: () => {
          setGroupName("");
          setUserLimit("");
          setStartDate("");
          setEndDate("");
          navigate("/groups");
        },
      }
    );
  };



  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-group-modal"
      aria-describedby="modal-to-create-or-edit-a-group"
    >
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 space-y-6">
        <IconButton
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h5"
          className="font-bold text-gray-800 text-center"
        >
          {initialData ? 'Edit Group' : 'Create New Group'}
        </Typography>

        <Divider className="p-3 text-gray-700" />

        <div className="space-y-4">
          <div>
            <InputLabel className="text-sm font-medium text-gray-700 mb-2">
              Group Name
            </InputLabel>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              sx={{
                borderRadius: '50px',
                '& .MuiOutlinedInput-root': {
                  padding: '0px',
                },
              }}
            />
          </div>

          <div>
            <InputLabel className="text-sm font-medium text-gray-700 mb-2">
              User Registeration Limit
            </InputLabel>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter user limit"
              value={userLimit}
              onChange={(e) => setUserLimit(e.target.value)}
              sx={{
                borderRadius: '50px',
                '& .MuiOutlinedInput-root': {
                  padding: '0px',
                },
              }}
            />
          <div className='pt-4'>
            
            <TextField
              label="Start date of the test*"
              type="date"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              value={formatDate(startDate)}
              onChange={(e) => setStartDate(e.target.value)}
            />
            </div>
            <div className='pt-4'>

            <TextField
              label="End date of the test*"
              type="date"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              value={formatDate(endDate)}
              onChange={(e) => setEndDate(e.target.value)}
            />


          </div>
          </div>

          {/*   {!initialData && (
            <a
              href="/userlist_format.xlsx"
              download="sample_users.xlsx"
              className="inline-block text-sm text-green-600 hover:text-green-800 underline transition-colors duration-200"
            >
              Download Sample
            </a>
          )} */}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200"
            disabled={!groupName}
          >
            {initialData ? 'Update Group' : 'Create Group'}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateGroupModal;
