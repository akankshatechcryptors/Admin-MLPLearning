import React from "react";
import { Card, CardContent, Typography, Box, Button, Chip } from "@mui/material";
const TestCards = ({ tests = [], onViewStats, onDelete }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tests ({tests.length})
      </Typography>
      {tests.map((test) => (
        <Card
          key={test.id}
          sx={{
            backgroundColor: "#e9f6e9", // light green like screenshot
            borderRadius: 2,
            boxShadow: "none",
            mb: 2,
            px: 2,
            py: 1,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              p: "8px !important",
            }}
          >
          

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {test.title} - {test.organization}
                  <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Chip
                label={test.status}
                size="small"
                sx={{
                  backgroundColor: "#ffeb3b",
                  color: "#000",
                  fontWeight: 500,
                }}
              />
            </Box>
              </Typography>
              

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {test.startDate} - {test.endDate}
              </Typography>
            </Box>

            <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
              <Button
                variant="text"
                size="small"
                sx={{ p: 0, textTransform: "none", color: "primary.main" }}
                onClick={() => onViewStats?.(test)}
              >
                View Stats
              </Button>
              <Button
                variant="text"
                size="small"
                sx={{ p: 0, textTransform: "none", color: "error.main" }}
                onClick={() => onDelete?.(test)}
              >
                Delete Test
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default TestCards;
