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
  const [excelFile, setExcelFile] = useState(null);
  const navigate = useNavigate();

  // Fill form if editing
  useEffect(() => {
    if (initialData) {
      setGroupName(initialData.title || '');
      setExcelFile(initialData.file || null);
    } else {
      setGroupName('');
      setExcelFile(null);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (groupName) {
      onSubmit({
        title: groupName,
        file: excelFile,
        count: initialData?.count || 0, // Keep doctor count when editing
        id: initialData?.id, // Keep id for editing
      });

      toast.success(
        initialData ? 'Group updated successfully!' : 'Group created successfully!',
        {
          position: 'top-right',
          autoClose: 2000,
          onClose: () => {
            setGroupName('');
            setExcelFile(null);
            navigate('/groups');
          },
        }
      );
    }
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
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
            <InputLabel className="text-sm font-medium text-gray-700 mb-2 p-5">
              Upload Users (Excel)
            </InputLabel>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 cursor-pointer p-3 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {excelFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected File:{' '}
                <span className="font-medium">
                  {excelFile.name || 'Previously uploaded file'}
                </span>
              </p>
            )}
          </div>

          {!initialData && (
            <a
              href="/userlist_format.xlsx"
              download="sample_users.xlsx"
              className="inline-block text-sm text-green-600 hover:text-green-800 underline transition-colors duration-200"
            >
              Download Sample
            </a>
          )}
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
