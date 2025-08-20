// components/AllotTestModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
} from "@mui/material";
import Groups from "../common/data/groups.json";

const AllotTestModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    groups: [], // store selected group titles
    attempts: "01",
    testType: "Online",
    shuffleType: "Shuffle Both",
    startDate: "",
    endDate: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Allot test - Third Test</DialogTitle>
      <DialogContent>
        {/* Groups */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Groups*</InputLabel>
          <Select
            multiple
            value={formData.groups}
            onChange={(e) => handleChange("groups", e.target.value)}
            renderValue={(selected) => selected.join(", ")}
          >
            {Groups.groups.map((group) => (
              <MenuItem key={group.id} value={group.title}>
                <Checkbox checked={formData.groups.includes(group.title)} />
                <ListItemText primary={`${group.title} (${group.count})`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>



        {/* Dates */}
        <TextField
          label="Start date of the test*"
          type="date"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={formData.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
        />
        <TextField
          label="End date of the test*"
          type="date"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={formData.endDate}
          onChange={(e) => handleChange("endDate", e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ backgroundColor: "#4CAF50" }}
        >
          Allot Test
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AllotTestModal;
