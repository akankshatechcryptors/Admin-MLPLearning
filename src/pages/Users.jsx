import React, { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Card from '../components/GroupCards';
import CreateGroupModal from '../components/CreateGroupModal';
import Breadcrumbs from '../components/BreadCrumb';
import groupData from '../common/data/groups.json';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializedGroups = groupData.groups.map((group, i) => ({
      ...group,
      count: group.count || 0,
      id: group.id || i + 1,
    }));
    setGroups(initializedGroups);
  }, []);

  const handleCreateGroup = (newGroup) => {
    if (editingGroup) {
      // Update existing group
      setGroups(groups.map(g =>
        g.id === editingGroup.id
          ? { ...g, title: newGroup.title, count: newGroup.count || g.count }
          : g
      ));
    } else {
      // Create new group
      setGroups([...groups, { id: groups.length + 1, title: newGroup.title, count: 0 }]);
    }
    setEditingGroup(null);
    setOpenGroupModal(false);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setOpenGroupModal(true);
  };

  const handleViewGroup = (title) => {
    navigate(`/users`, { state: { title } });
  };

  const handleDeleteGroup = (id) => {
    setGroups(groups.filter(g => g.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Box className="flex justify-between items-center mb-6">
        <Breadcrumbs />
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingGroup(null);
            setOpenGroupModal(true);
          }}
           sx={{ borderRadius: '50px', '&:hover': { backgroundColor: '#e3f2ff' } }}
        >
          Create Group
        </Button>
      </Box>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card
            key={group.id}
            title={group.title}
            count={group.count}
            onView={() => handleViewGroup(group.title)}
            onEdit={() => handleEditGroup(group)}
            onDelete={() => handleDeleteGroup(group.id)}
          />
        ))}
      </div>

      <CreateGroupModal
        open={openGroupModal}
        onClose={() => {
          setEditingGroup(null);
          setOpenGroupModal(false);
        }}
        onSubmit={handleCreateGroup}
        initialData={editingGroup}
      />
    </div>
  );
};

export default Users;
