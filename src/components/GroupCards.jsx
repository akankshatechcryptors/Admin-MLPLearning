import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';

const Card = ({ title, count, onEdit, onDelete, onView }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-lg p-[1.5vw] m-2 shadow-md bg-blue-200 flex justify-between items-center"
    >
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-600">{count} Users</p>
      </div>
      <div className="flex gap-1">
        <Tooltip title="View Users">
          <IconButton onClick={onView} color="primary" aria-label="view">
            <VisibilityIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Edit Group">
          <IconButton onClick={onEdit} color="primary" aria-label="edit">
            <EditIcon />
          </IconButton>
        </Tooltip>

        {/* <Tooltip title="Delete Group">
          <IconButton onClick={onDelete} color="error" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip> */}
      </div>
    </motion.div>
  );
};

export default Card;
