import React, { useState, useEffect, useMemo } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import {
  Modal,
  TextInput,
  PasswordInput,
  Group,
  Loader,
} from "@mantine/core";
import { Button, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { randomId } from "@mantine/hooks";
import admin from "../common/data/user.json";
import Breadcrumbs from "../components/BreadCrumb";

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });

  // Get logged-in user from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // Load admins from JSON
  useEffect(() => {
    setAdmins(admin);
    setLoading(false);
  }, []);

  // Filter out the logged-in admin
  const filteredAdmins = useMemo(
    () => admins.filter((a) => a.id !== loggedInUser?.id),
    [admins, loggedInUser]
  );

  // Add or update admin
  const handleSaveAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.contact || !newAdmin.password) {
      alert("Please fill all fields");
      return;
    }

    if (editMode) {
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === editId ? { ...a, ...newAdmin } : a
        )
      );
    } else {
      const adminObj = {
        id: randomId(),
        ...newAdmin,
        token: `token${Date.now()}`,
      };
      setAdmins((prev) => [...prev, adminObj]);
    }

    setNewAdmin({ name: "", email: "", contact: "", password: "" });
    setEditMode(false);
    setEditId(null);
    setModalOpen(false);
  };

  // Edit admin
  const handleEditAdmin = (adminData) => {
    setNewAdmin({
      name: adminData.name,
      email: adminData.email,
      contact: adminData.contact,
      password: adminData.password || "",
    });
    setEditId(adminData.id);
    setEditMode(true);
    setModalOpen(true);
  };

  // Delete admin
  const handleDeleteAdmin = (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Memoized columns
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
      { accessorKey: "contact", header: "Contact" },
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
              onClick={() => handleDeleteAdmin(row.original.id)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    [] // static columns
  );

  // Memoized table data
  const tableData = useMemo(() => filteredAdmins, [filteredAdmins]);

  const table = useMantineReactTable({
    columns,
    data: tableData,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
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
            setNewAdmin({ name: "", email: "", contact: "", password: "" });
            setEditMode(false);
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
          setEditMode(false);
          setNewAdmin({ name: "", email: "", contact: "", password: "" });
        }}
        title={editMode ? "Edit Admin" : "Add New Admin"}
        centered
      >
        <TextInput
          label="Name"
          placeholder="Enter name"
          value={newAdmin.name}
          onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
          mb="sm"
        />
        <TextInput
          label="Email"
          placeholder="Enter email"
          value={newAdmin.email}
          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          mb="sm"
        />
        <TextInput
          label="Contact"
          placeholder="Enter contact number"
          value={newAdmin.contact}
          onChange={(e) => setNewAdmin({ ...newAdmin, contact: e.target.value })}
          mb="sm"
        />
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          value={newAdmin.password}
          onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          mb="sm"
        />
 