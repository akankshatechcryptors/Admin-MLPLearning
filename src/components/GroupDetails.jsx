import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Alert,
  Typography,
} from '@mui/material';
import { useLocation ,useNavigate} from 'react-router-dom';
import { useMantineTheme } from '@mantine/core';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getUsers,
  getGroups,
  addToGroup,
  removeFromGroup,
} from '../common/api.js';
import { toast } from 'react-toastify';
import { Cell } from 'recharts';

const GroupDetails = ({ onEditClick }) => {
  const [users, setUsers] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [selectedGroupsMap, setSelectedGroupsMap] = useState({}); // {userEmail: [groupIds]}
  const [changedUsers, setChangedUsers] = useState({}); // track changed selections
  const [confirmAction, setConfirmAction] = useState(null);
  const [update, setUpdate] = useState(false);
  const theme = useMantineTheme();
  const location = useLocation();
  const { state } = location;
  const groupName = state?.title || '';
  const groupId = state?.id || '';
  const navigate=useNavigate()
  const handleUpdate = () => setUpdate(!update);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await getUsers({ group_id: groupId });
      //console.log(res);
      if (!res.data.error) {
        const mappedUsers = res.data.users.map((u) => ({
          ...u,
          groups: u.groups || [],
          name: u.fullname,
        }));
        setUsers(mappedUsers);

        // Initialize selectedGroupsMap
        const map = {};
        mappedUsers.forEach((u) => {
          map[u.email] = u.groups.map((g) => g.id);
        });
        setSelectedGroupsMap(map);
        setChangedUsers({}); // reset change flags
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      if (!res.data.error) {
        setAllGroups(res.data.groups);
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, [groupId, update]);

  const handleEdit = (user) => onEditClick(user);
  const handleDelete = (user) => setConfirmAction({ type: 'deleteUser', user });
  const handleRemoveFromGroup = (user, group) => {
    setConfirmAction({ type: 'removeFromGroup', user, group });
  };

  const confirmDelete = async () => {
    if (confirmAction.type === 'deleteUser') {
      handleUpdate();
      toast.success('User deleted successfully!');
    } else if (confirmAction.type === 'removeFromGroup') {
      try {
        const data = { user_id: confirmAction.user.id, group_id: groupId };
        const res = await removeFromGroup(data);
        toast.success(res.data.message || 'User removed from group');
        handleUpdate();
      } catch (err) {
        console.error('Failed to remove user from group:', err);
        toast.error('Failed to remove user from group');
      }
    }
    setConfirmAction(null);
  };

  const cancelDelete = () => setConfirmAction(null);

  // Handle dropdown selection changes
  const handleGroupChange = (user, selectedIds) => {
    setSelectedGroupsMap((prev) => ({ ...prev, [user.email]: selectedIds }));

    // Detect changes
    const originalIds = user.groups.map((g) => g.id);
    const isChanged =
      selectedIds.length !== originalIds.length ||
      !selectedIds.every((id) => originalIds.includes(id));
    setChangedUsers((prev) => ({ ...prev, [user.email]: isChanged }));
  };

  // Save selected groups for a user
  const saveGroupsForUser = async (user) => {
    const selectedIds = selectedGroupsMap[user.email] || [];
    try {
      await addToGroup({ user_id: user.id, group_ids: selectedIds });
      const updatedGroups = allGroups.filter((g) => selectedIds.includes(g.id));
      setUsers((prev) =>
        prev.map((u) =>
          u.email === user.email ? { ...u, groups: updatedGroups } : u,
        ),
      );
      setChangedUsers((prev) => ({ ...prev, [user.email]: false }));
      toast.success('Groups updated successfully!');
    } catch (err) {
      console.error('Failed to update groups:', err);
      toast.error('Failed to update groups');
    }
  };

  const columns = [
    { header: 'Sr No.', accessorFn: (_, index) => index + 1, size: 60 },
    { accessorKey: 'name', header: 'Fullname' },
    { accessorKey: 'email', header: 'Email ID' },
    { accessorKey: 'type', header: 'Speciality',  Cell: ({ cell }) => {
      const value = cell.getValue();
      // Capitalize first letter manually
      return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
    }, },
    { accessorKey: 'contact', header: 'Phone' },
  // If NOT viewing a specific group → show dropdown
!groupName
  ? {
      header: "Groups",
      accessorKey: "groups",
      Cell: ({ row }) => {
        const user = row.original;
        const value = selectedGroupsMap[user.email] || [];

        const getChipColor = (status) => {
          switch (status) {
            case "pass":
              return "success";
            case "fail":
              return "error";
            case "pending":
              return "warning";
            default:
              return "default";
          }
        };

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Select
              multiple
              value={value}
              onChange={(e) => handleGroupChange(user, e.target.value)}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => {
                    const group = allGroups.find((g) => g.id === id);
                    const userGroup = user.groups.find((g) => g.id === id);
                    const status = userGroup?.status || null;
                    const color = getChipColor(status);

                    return (
                      <Chip
                        key={id}
                        label={`${group?.title || ""}`}
                        color={color}
                        size="small"
                        variant="filled"
                        sx={{
                          fontWeight: 500,
                          textTransform: "none",
                          bgcolor:
                            color === "default" ? "#9e9e9e" : undefined,
                          color:
                            color === "default" ? "white" : undefined,
                        }}
                      />
                    );
                  })}
                </Box>
              )}
              size="small"
              sx={{ minWidth: 180 }}
            >
              {allGroups.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.title}
                </MenuItem>
              ))}
            </Select>

            {changedUsers[user.email] && (
              <Button
                size="small"
                variant="contained"
                onClick={() => saveGroupsForUser(user)}
              >
                Save
              </Button>
            )}
          </Box>
        );
      },
    }
  : // If groupName exists → show status chip only
    {
      header: "Exam Status",
      accessorKey: "status",
      Cell: ({ row }) => {
        const user = row.original;

        // find the matching group details for this group
        const groupData = user.groups.find((g) => g.id === groupId);
        const status = groupData?.status || null;

        const getChipColor = (status) => {
          switch (status) {
            case "pass":
              return "success";
            case "fail":
              return "error";
            case "pending":
              return "warning";
            default:
              return "default";
          }
        };

        const color = getChipColor(status);
        const label =
          status === "pass"
            ? "Passed"
            : status === "fail"
            ? "Failed"
            : status === "pending"
            ? "Pending"
            : "Not Attempted";

        return (
          <Chip
            label={label}
            color={color}
            size="small"
            variant="filled"
            sx={{
              fontWeight: 500,
              textTransform: "none",
              bgcolor:
                color === "default" ? "#9e9e9e" : undefined,
              color: color === "default" ? "white" : undefined,
            }}
          />
        );
      },
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
          {/* {!groupName && (
            <IconButton size="small" color="error" onClick={() => handleDelete(row.original)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )} */}
          {groupName && (
            <Button
              size="small"
              color="error"
              onClick={() => handleRemoveFromGroup(row.original, groupName)}
            >
              Remove
            </Button>
          )}
        </>
      ),
      size: 250,
    },
  ].filter(Boolean);

  const table = useMantineReactTable({
    columns,
    data: users,
    mantineTableProps: {
      striped: true,
      highlightOnHover: true,
      withBorder: true,
      sx: (theme) => ({
        fontSize: '1.5vw', // default

        // Extra small screens
        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
          fontSize: '3.5vw',
        },

        // Small screens
        [`@media (min-width: ${theme.breakpoints.sm}px) and (max-width: ${
          theme.breakpoints.md - 1
        }px)`]: {
          fontSize: '2.5vw',
        },

        // Medium screens
        [`@media (min-width: ${theme.breakpoints.md}px) and (max-width: ${
          theme.breakpoints.lg - 1
        }px)`]: {
          fontSize: '2vw',
        },

        // Large screens
        [`@media (min-width: ${theme.breakpoints.lg}px) and (max-width: ${
          theme.breakpoints.xl - 1
        }px)`]: {
          fontSize: '1.5vw',
        },

        // Extra large screens
        [`@media (min-width: ${theme.breakpoints.xl}px)`]: {
          fontSize: '1.2vw',
        },
      }),
    },
    mantinePaginationProps: { size: 'lg', radius: 'lg' },
  });

  return (
    <Box sx={{ padding: 0 }}>
      {!groupName && (
        <Box mb={2}>
          <Alert severity="info" variant="outlined">
            <strong>Note:</strong> Each user may belong to one or more groups.
            The colored chips indicate the exam status for that group:
            <br />
            🟢 <strong>Green</strong> — Passed &nbsp;|&nbsp; 🟡{' '}
            <strong>Yellow</strong> — Pending &nbsp;|&nbsp; 🔴{' '}
            <strong>Red</strong> — Failed &nbsp;|&nbsp; ⚪ <strong>Gray</strong>{' '}
            — No exam status available.
            <br />
            You can also add or remove a user from groups using the dropdown.
            Click <strong>Save</strong> to apply changes.
          </Alert>
        </Box>
      )}
      {groupName && (
  <Box
    onClick={() =>
      navigate("/add-questions", {
        state: {
          testName: users[0]?.groups[0]?.title,
          instructions: users[0]?.groups[0]?.description,
          id: users[0]?.groups[0]?.exam_id,
          startDate: users[0]?.groups[0]?.start_date,
        },
      })
    }
    sx={{
      cursor: "pointer",
      p: 1,
      mb: 1,
      borderRadius: 2,
      boxShadow: 3,
      backgroundColor: "#f5f5f5",
      "&:hover": {
        backgroundColor: "#e0e6faff",
        boxShadow: 6,
      },
      textAlign:'center'
    }}
  >
    <Typography variant="h6" fontWeight="bold">
     Exam :-  {users[0]?.groups[0]?.title}
    </Typography>
  </Box>
)}

      <MantineReactTable table={table} />
      <Dialog open={!!confirmAction} onClose={cancelDelete}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          {confirmAction?.type === 'deleteUser'
            ? `Are you sure you want to permanently delete this user?`
            : `Remove ${confirmAction?.user?.name} from ${confirmAction?.group}?`}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupDetails;
