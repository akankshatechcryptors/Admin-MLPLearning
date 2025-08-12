import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import usersList from '../common/data/userList.json';

const GroupDetails = ({onEditClick}) => {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const { state } = location;
  const groupName = state?.title || 'Neurology';

  useEffect(() => {
    const groupData = usersList.find(group => group.groupName === groupName);
    if (groupData) {
      setUsers(groupData.users);
    } else {
      setUsers([]);
    }
  }, [groupName]);

  const handleEdit = (user) => {
    console.log('Edit user:', user);
    // Edit logic here
    onEditClick(user)
  };

  const handleDelete = (user) => {
    console.log('Delete user:', user);
    // Delete logic here
  };

  const columns = [
    {
      header: 'Sr No.',
      accessorFn: (_, index) => index + 1,
      size: 60,
    },
    {
      accessorKey: 'name',
      header: 'User Name',
    },
    {
      accessorKey: 'email',
      header: 'Email ID',
    },
    {
      accessorKey: 'type',
      header: 'Speciality',
    },
    {
      accessorKey: 'contact',
      header: 'Phone',
    },
    {
      header: 'Actions',
      accessorFn: (row) => row,
      Cell: ({ row }) => (
        <>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(row.original)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(row.original)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
      size: 100,
    },
  ];

  const table = useMantineReactTable({
    columns,
    data: users,
    enableColumnFilters: false,
    enablePagination: true,
    enableSorting: true,
    initialState: {
      density: 'xs',
      pagination: { pageSize: 10 },
    },
    mantineTableProps: {
      striped: true,
      highlightOnHover: true,
      withBorder: true,
      withColumnBorders: false,
    },
    mantinePaginationProps: {
      size: 'md',
      radius: 'lg',
    },
  });

  return (
    <Box sx={{ padding: 0 }}>  
      <MantineReactTable table={table} />
    </Box>
  );
};

export default GroupDetails;
