import React, { useState, useEffect } from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Card from '../components/GroupCards';
import CreateGroupModal from '../components/CreateGroupModal';
import Breadcrumbs from '../components/BreadCrumb';
import { useNavigate } from 'react-router-dom';
import { addGroup, getGroups, editGroup } from '../common/api';

const Groups = () => {
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [update, setUpdate] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loader state
  const navigate = useNavigate();

  const handleUpdate = () => setUpdate(!update);

  // Fetch groups from API
  const getGroupdata = async () => {
    setLoading(true);
    try {
      const res = await getGroups();
      if (!res.data.error) setGroups(res.data.groups);
    } catch (err) {
      console.error('Failed to fetch groups:', err);
    } finally {
      setLoading(false); // ✅ hide loader after fetch
    }
  };

  useEffect(() => {
    getGroupdata();
  }, [update]);

  const handleCreateGroup = async (newGroup) => {
    if (editingGroup) {
      // Edit group: only send id and new title
      try {
        const data = {
          group_id: editingGroup.id,
          title: newGroup.title,
          registration_limit: newGroup.registration_limit,
          start_date: newGroup.start_date,
          end_date: newGroup.end_date,
        };
        //console.log('edit data: ',data);

        const res = await editGroup(data);
        //console.log("updated group data: ",res);
        handleUpdate();
      } catch (err) {
        console.error('Failed to edit group:', err);
      }
    } else {
      // Create new group
      try {
        const data = {
          title: newGroup.title,
          registration_limit: newGroup.registration_limit,
          start_date: newGroup.start_date,
          end_date: newGroup.end_date,
        };
        const res = await addGroup(data);
        //console.log("created group data: ",res);
        handleUpdate();
      } catch (err) {
        console.error('Failed to add group:', err);
      }
    }

    setEditingGroup(null);
    setOpenGroupModal(false);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setOpenGroupModal(true);
  };

  const handleViewGroup = (title, id) => {
    navigate(`/users`, { state: { title, id } });
  };

  const handleDeleteGroup = (id) => {
    setGroups(groups.filter((g) => g.id !== id));
  };

  return (
    <div className="p-[2vw] bg-gray-50 min-h-screen">
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
          sx={{
            borderRadius: '50px',
            '&:hover': { backgroundColor: '#e3f2ff' },
          }}
        >
          Create Group
        </Button>
      </Box>

      {/* ✅ Loader while fetching */}
      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress />
        </Box>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card
              key={group.id}
              title={group.title}
              count={group.user_count}
              onView={() => handleViewGroup(group.title, group.id)}
              onEdit={() => handleEditGroup(group)}
              onDelete={() => handleDeleteGroup(group.id)}
              start_date={group.start_date}
              end_date={group.end_date}
            />
          ))}
        </div>
      )}

      <CreateGroupModal
        open={openGroupModal}
        onClose={() => {
          setEditingGroup(null);
          setOpenGroupModal(false);
        }}
        onSubmit={handleCreateGroup}
        initialData={editingGroup}
        hideUserUpload={!!editingGroup} // hide upload users when editing
      />
    </div>
  );
};

export default Groups;
