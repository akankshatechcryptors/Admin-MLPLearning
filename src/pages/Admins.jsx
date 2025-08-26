import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Modal, Group } from "@mantine/core";
import {
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Breadcrumbs from "../components/BreadCrumb";
import ConfirmDeleteDialog from "../common/ConfirmDelete";
import { toast } from "react-toastify";
import { encryptPassword } from "../common/crypt"; 
import { getAdmins, addAdmin, editAdmin } from "../common/api";

const roleMap = {
  superadmin: "Super Admin",
  admin: "Content Admin",
  observer: "Observer",
};

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  const handleUpdate = () => setUpdate(!update);

  const [newAdmin, setNewAdmin] = useState({
    fullname: "",
    email: "",
    password: "",
    type: "observer",
  });

  // Fetch admins from backend
  const getData = async () => {
    try {
      setLoading(true);
      const res = await getAdmins();
      const users = res.data.users.map((u, index) => ({
        ...u,
        srNo: index + 1,
        type: roleMap[u.type] || u.type,
      }));
      setAdmins(users);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [update]);

  const resetForm = useCallback(() => {
    setNewAdmin({
      fullname: "",
      email: "",
      password: "",
      type: "observer",
    });
    setEditMode(false);
    setEditId(null);
  }, []);

  const sanitizeInput = (value) => {
    if (!value) return "";
    let trimmed = value.trim(); // remove leading/trailing spaces
    trimmed = trimmed.replace(/"/g, ""); // remove double quotes
    return trimmed;
  };

  const handleSaveAdmin = useCallback(async () => {
    const fullname = sanitizeInput(newAdmin.fullname);
    const email = sanitizeInput(newAdmin.email);
    const password = sanitizeInput(newAdmin.password);
    const type = newAdmin.type;

    if (!fullname || !email || !type) {
      alert("Please fill all required fields");
      return;
    }

    const encryptedPassword = password ? encryptPassword(password) : null;

    try {
      if (editMode) {
        // Update via API
        const res =await editAdmin({id:editId,fullname, email, type, password: encryptedPassword });
        console.log(res)
        if(!res.data.error){
          toast.success("Admin updated successfully");
        }
        else{
          toast.error(res.data.message)
        }

      } else {
      
        await addAdmin({ fullname, email, type, password: encryptedPassword });
        toast.success("Admin added successfully");
      }
      handleUpdate();
      setModalOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save admin");
    }
  }, [newAdmin, editMode, editId, resetForm]);

  const handleEditAdmin = useCallback((adminData) => {
    setNewAdmin({
      fullname: adminData.fullname,
      email: adminData.email,
      password: "", // always blank on edit
      type:
        adminData.type === "Content Admin"
          ? "admin"
          : adminData.type === "Super Admin"
          ? "superadmin"
          : "observer",
    });
    setEditId(adminData.id);
    setEditMode(true);
    setModalOpen(true);
  }, []);

  const requestDeleteAdmin = useCallback((id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    setAdmins((prev) => prev.filter((a) => a.id !== deleteId));
    setConfirmOpen(false);
    toast.success("Admin deleted successfully");
  }, [deleteId]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "srNo",
        header: "Sr. No.",
        size: 50,
      },
      { accessorKey: "fullname", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "type", header: "Role" },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 100,
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <IconButton
              color="primary"
              onClick={() => handleEditAdmin(row.original)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => requestDeleteAdmin(row.original.id)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    [handleEditAdmin, requestDeleteAdmin]
  );

  const table = useMantineReactTable({ columns, data: admins, state: { isLoading: loading } });

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Group position="apart" className="mb-4" style={{ alignItems: "center" }}>
        <Breadcrumbs />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Admins Management
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ borderRadius: "50px", "&:hover": { backgroundColor: "#e3f2ff" } }}
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          Add Admin
        </Button>
      </Group>

      <MantineReactTable table={table} />

      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editMode ? "Edit Admin" : "Add New Admin"}
        centered
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Name"
            value={newAdmin.fullname}
            onChange={(e) =>
              setNewAdmin((p) => ({ ...p, fullname: e.target.value }))
            }
          />
          <TextField
            label="Email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin((p) => ({ ...p, email: e.target.value }))}
          />
          <TextField
            label="Password"
            type="password"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin((p) => ({ ...p, password: e.target.value }))}
          />
          <FormControl fullWidth>
            <InputLabel>Admin Type</InputLabel>
            <Select
              value={newAdmin.type}
              label="Admin Type"
              onChange={(e) => setNewAdmin((p) => ({ ...p, type: e.target.value }))}
            >
              <MenuItem value="superadmin">Super Admin</MenuItem>
              <MenuItem value="admin">Content Admin</MenuItem>
              <MenuItem value="observer">Observer</MenuItem>
            </Select>
          </FormControl>

          <Group position="right" mt="md">
            <Button variant="contained" onClick={handleSaveAdmin}>
              {editMode ? "Update" : "Save"}
            </Button>
          </Group>
        </Box>
      </Modal>

      <ConfirmDeleteDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Admin"
        message="Are you sure you want to delete this admin?"
      />
    </Box>
  );
};

export default AdminsPage;
