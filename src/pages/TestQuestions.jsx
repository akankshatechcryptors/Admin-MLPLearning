import React, { useState } from "react";
import TestFoldersList from "../components/TestFolder";
import Breadcrumbs from "../components/BreadCrumb";
import { Box, Typography, Button } from "@mui/material";
import Test from '../components/Test'
// Inside TestCards component state

export default function TestPage() {

  return (
    <Box className="p-[2vw] bg-gray-50 min-h-screen">
   <Test/>
    </Box>
  );
}
