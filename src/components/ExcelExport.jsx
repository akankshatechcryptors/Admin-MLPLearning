// src/components/ExportToExcelButton.jsx
import React from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const ExportToExcelButton = ({ data = [], columns = [], fileName = 'exported_data' }) => {
  //console.log('excel upload')
  const handleExport = () => {
    if (!data || data.length === 0) {
      console.warn("No data to export");
      return;
    }

    // Map data to columns (if columns provided)
    const exportData = columns.length
      ? data.map((row) => {
          const obj = {};
          columns.forEach((col) => {
            obj[col.label || col.headerName || col.key] = row[col.key || col.field];
          });
          return obj;
        })
      : data;

    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate Excel file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
      sx={{
        borderRadius: '25px',
        textTransform: 'none',
        bgcolor: '#0077B6',
        '&:hover': { bgcolor: '#005f8a' },
      }}
    >
      Export to Excel
    </Button>
  );
};

export default ExportToExcelButton;
