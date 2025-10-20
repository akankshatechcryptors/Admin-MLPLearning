// components/AllotTestModal.jsx
import React, { useState, useEffect } from "react";
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
  Typography,
} from "@mui/material";
import { getGroups } from "../common/api";
import { toast } from "react-toastify"; 

const AllotTestModal = ({ open, onClose, onSubmit, selectedTest, error, disable,group }) => {
  const [Groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    exam_id: selectedTest || '',
    group_ids:group[0]?.id ||[], // single select
    start_date:group[0]?.start_date ||"",
    end_date: group[0]?.end_date||"",
  });
  useEffect(() => {
    if (selectedTest) {
      setFormData((prev) => ({ ...prev, exam_id: selectedTest }));
    }
  }, [selectedTest]);

  const getGroupdata = async () => {
    try {
      const res = await getGroups();
      if (!res.data.error) setGroups(res.data.groups);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    }
  };

  useEffect(() => {
    getGroupdata();
  }, []);
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const { group_ids, start_date, end_date } = formData;

    if (!group_ids || !start_date || !end_date) {
      toast.error("Please fill all required fields (Group, Start Date, End Date)");
      return;
    }

    onSubmit(formData);
    onClose();
    setFormData({
      exam_id: '',
      group_ids: [],
      start_date: "",
      end_date: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Allot test</DialogTitle>
      <DialogContent>
        {error !== null && <Typography variant="p" textAlign="center" color="error">{error}</Typography>}

        {/* Groups */}
       {!group?.length>0 &&( <FormControl fullWidth margin="dense">
          <InputLabel>Group*</InputLabel>
          <Select
            value={formData.group_ids}
            disabled={disable}
            onChange={(e) => handleChange("group_ids", e.target.value)}
            label="Group*"
          >
            {Groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {`${group.title} (${group.user_count})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
)}
        {/* Dates */}
        <TextField
          label="Start date of the test*"
          type="date"
          fullWidth
          margin="dense"
          disabled={disable}
          InputLabelProps={{ shrink: true }}
          value={formData.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
        />
        <TextField
          label="End date of the test*"
          type="date"
          fullWidth
          margin="dense"
          disabled={disable}
          InputLabelProps={{ shrink: true }}
          value={formData.end_date}
          onChange={(e) => handleChange("end_date", e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={disable}
          sx={{ backgroundColor: "#4CAF50" }}
        >
          Allot Test
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AllotTestModal;
