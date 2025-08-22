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
import admin from "../common/data/user.json";
import Breadcrumbs from "../components/BreadCrumb";
import ConfirmDeleteDialog from "../common/ConfirmDelete";
import { toast } from "react-toastify";
import { encryptPassword } from "../common/crypt"; // 🔑 encryption util

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    type: "Observer", // default
  });

  useEffect(() => {
    setAdmins(admin);
    setLoading(false);
  }, []);

  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const filteredAdmins = useMemo(
    () => admins.filter((a) => a.id !== loggedInUser?.id),
    [admins, loggedInUser]
  );

  const resetForm = useCallback(() => {
    setNewAdmin({
      name: "",
      email: "",
      contact: "",
      password: "",
      type: "Observer",
    });
    setEditMode(false);
    setEditId(null);
  }, []);

  const handleSaveAdmin = useCallback(() => {
    const { name, email, contact, password, type } = newAdmin;
    if (!name || !email || !contact || !type) {
      alert("Please fill all fields");
      return;
    }

    // 🔐 Encrypt password if provided
    const encryptedPassword = password ? encryptPassword(password) : null;

    if (editMode) {
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === editId
            ? {
                ...a,
                name,
                email,
                contact,
                type,
                ...(encryptedPassword ? { password: encryptedPassword } : {}),
              }
            : a
        )
      );
      toast.success("Admin updated successfully");
    } else {
      if (!encryptedPassword) {
        alert("Password is required for new admins");
        return;
      }
      const nextId =
        Math.max(0, ...admins.map((a) => Number(a.id) || 0)) + 1;
      setAdmins((prev) => [
        ...prev,
        {
          id: nextId,
          name,
          email,
          contact,
          type,
          password: encryptedPassword, // ✅ encrypted
          token: `token${nextId}`,
        },
      ]);
      toast.success("Admin added successfully");
    }

    resetForm();
    setModalOpen(false);
  }, [newAdmin, editMode, editId, admins, resetForm]);

  const handleEditAdmin = useCallback((adminData) => {
    setNewAdmin({
      name: adminData.name,
      email: adminData.email,
      contact: adminData.contact,
      password: "", // always blank when editing
      type: adminData.type || "Observer",
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
        Cell: ({ row }) => row.index + 1,
      },
      { accessorKey: "name", header: "Name" },
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

  const table = useMantineReactTable({ columns, data: filteredAdmins });

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Group
        position="apart"
        className="mb-4"
        style={{ alignItems: "center" }}
      >
        <Breadcrumbs />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Admins Management
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: "50px",
            "&:hover": { backgroundColor: "#e3f2ff" },
          }}
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          Add Admin
        </Button>
      </Group>

      <MantineReactTable table={table} />

      {/* Modal for Add/Edit */}
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
            value={newAdmin.name}
            onChange={(e) =>
              setNewAdmin((p) => ({ ...p, name: e.target.value }))
            }
          />
          <TextField
            label="Email"
            value={newAdmin.email}
            onChange={(e) =>
              setNewAdmin((p) => ({ ...p, email: e.target.value }))
            }
          />
          <TextField
            label="Password"
            type="password"
            value={newAdmin.password}
            onChange={(e) =>
              setNewAdmin((p) => ({ ...p, password: e.target.value }))
            }
          />

          <FormControl fullWidth>
            <InputLabel>Admin Type</InputLabel>
            <Select
              value={newAdmin.type}
              label="Admin Type"
              onChange={(e) =>
                setNewAdmin((p) => ({ ...p, type: e.target.value }))
              }
            >
              <MenuItem value="Superadmin">Super Admin</MenuItem>
              <MenuItem value="ContentAdmin">Content Admin</MenuItem>
              <MenuItem value="Observer">Observer</MenuItem>
            </Select>
          </FormControl>

          <Group position="right" mt="md">
            <Button variant="contained" onClick={handleSaveAdmin}>
              {editMode ? "Update" : "Save"}
            </Button>
          </Group>
        </Box>
      </Modal>

      {/* Reusable Confirmation Dialog */}
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
