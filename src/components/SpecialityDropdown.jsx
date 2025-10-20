import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";

const specialityList = [
  "Primary Care Physician",
  "Consultant Physician",
  "Nursing",
  "Physiotherapy",
  "Allergy and Immunology",
  "Anesthesiology",
  "Dermatology",
  "Emergency medicine",
  "Endocrinology",
  "Cardiac surgery",
  "Cardiology",
  "Critical care",
  "Infectious disease",
  "Internal medicine",
  "Family medicine",
  "Nephrology",
  "Neurology",
  "Obstetrics and gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedic surgery",
  "Otolaryngology",
  "Oral and maxillofacial surgery",
  "Pathology",
  "Pediatrics",
  "Rheumatology",
  "Physical medicine and rehabilitation",
  "Preventative medicine",
  "Pulmonary medicine",
  "Psychiatry",
  "Radiology",
  "General surgery",
  "Urology",
  "Neurosurgery",
  "Plastic surgery",
  "Gastroenterology",
  "Others"
];

const SpecialityDropdown = ({ value, handleChange, imp }) => {
  const [options, setOptions] = useState(specialityList);

  // Handle change (and add new if typed manually)
  const handleSpecialityChange = (event, newValue) => {
    if (newValue && !options.includes(newValue)) {
      setOptions((prev) => [...prev, newValue]);
    }
    handleChange({ target: { name: "type", value: newValue } });
  };

  return (
    <Box width="100%">
      <Autocomplete
        freeSolo
        options={options}
        value={value || ""}
        onChange={(event, newValue) => handleSpecialityChange(event, newValue)}
        onInputChange={(event, newInputValue) => {
          if (event && event.type === "change") {
            handleChange({ target: { name: "type", value: newInputValue } });
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Speciality"
            placeholder="Search or add speciality"
            fullWidth
            required={imp}
          />
        )}
      />
    </Box>
  );
};

export default SpecialityDropdown;