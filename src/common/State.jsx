import React from "react";
import { TextField, MenuItem,Box } from "@mui/material";

import { styled } from "@mui/material/styles";
const statesInIndia = ["Other",
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];


const StateDropdown = ({ handleChange, value, imp }) => {
  return (
    <TextField
      select
      label={
        <>
          State {imp && <span style={{ color: "red" }}> *</span>}
        </>
      }
      value={value || ""}
      onChange={handleChange}
      fullWidth
      variant="outlined"

    >
      <MenuItem value="">-- Select a State --</MenuItem>
      {statesInIndia.map((state, index) => (
        <MenuItem key={index} value={state}>
          {state}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default StateDropdown;
