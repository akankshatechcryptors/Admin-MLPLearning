import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';

  function toLocalDateString(dateTimeString) {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  //const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${year}`;
}

function getShortMonthName(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.toLocaleString('default', { month: 'short' }); 
}


function formatDateShortMonth(dateTimeString) {
  const date = new Date(dateTimeString);
  //const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return ` ${month} ${year}`;
}


const Card = ({ title, count, onEdit, onDelete, onView,start_date,end_date }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-lg p-[1.5vw] m-2 shadow-md bg-blue-200 flex justify-between items-center"
    >
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-600">{count} Users</p>
        <p className="text-sm text-gray-600"> {formatDateShortMonth(start_date)} -  {formatDateShortMonth(end_date)}</p>
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
