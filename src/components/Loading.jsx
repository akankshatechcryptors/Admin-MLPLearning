import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function LoadingScreen({message}) {
  return (
    <Box
      className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Animated Dots */}
      <Box className="flex space-x-2 mb-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-blue-500 rounded-full"
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e3a8a" }}>
        {message}
      </Typography>
    </Box>
  );
}
