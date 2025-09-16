// components/AllotTestModal.jsx
import React, { useState,useEffect } from "react";
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
import { getGroups } from "../common/api";
const AllotTestModal = ({ open, onClose, onSubmit ,selectedTest}) => {
  const [Groups,setGroups]=useState([])
  
  const [formData, setFormData] = useState({
    exam_id:selectedTest||'',
    group_ids: [], // store selected group titles
    start_date: "",
    end_date: "",
  });
  useEffect(() => {
  if (selectedTest) {
    setFormData((prev) => ({ ...prev, exam_id: selectedTest }));
  }
}, [selectedTest]);
   // Fetch groups from API
    const getGroupdata = async () => {
      try {
        const res = await getGroups();
        //console.log(res)
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
    onSubmit(formData);
    onClose();
    setFormData({
      exam_id:'',
    group_ids: [], // store selected group titles
    start_date: "",
    end_date: "",
    })
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Allot test</DialogTitle>
      <DialogContent>
        {/* Groups */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Groups*</InputLabel>
         <Select
  multiple
  value={formData.group_ids}
  onChange={(e) => handleChange("group_ids", e.target.value)}
  renderValue={(selected) =>
    Groups.filter((g) => selected.includes(g.id)).map((g) => g.title).join(", ")
  }
>
  {Groups.map((group) => (
    <MenuItem key={group.id} value={group.id}>
      <Checkbox checked={formData.group_ids.includes(group.id)} />
      <ListItemText primary={`${group.title} (${group.user_count})`} />
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
          value={formData.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
        />
        <TextField
          label="End date of the test*"
          type="date"
          fullWidth
          margin="dense"
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
          sx={{ backgroundColor: "#4CAF50" }}
        >
          Allot Test
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AllotTestModal;
