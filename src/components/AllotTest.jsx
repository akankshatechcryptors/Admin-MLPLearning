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
  Typography,
} from "@mui/material";
import { getGroups } from "../common/api";
import { toast } from "react-toastify"; // ✅ import toast
const AllotTestModal = ({ open, onClose, onSubmit ,selectedTest,error,disable}) => {
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
      const { group_ids, start_date, end_date } = formData;

    // ✅ Validation
    if (!group_ids.length || !start_date || !end_date) {
      toast.error("Please fill all required fields (Groups, Start Date, End Date)");
      return; // stop submission
    }

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
              {error!==null && <Typography variant="p" textAlign="center" color="error">{error}</Typography>}

        <FormControl fullWidth margin="dense">
          <InputLabel>Groups*</InputLabel>
         <Select
  multiple
  value={formData.group_ids}
  disabled={disable}
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
