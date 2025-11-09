import React from "react";
import { Box, Chip, Typography } from "@mui/material";

const CartUsers: React.FC<{ users: Record<string, { name: string }> }> = ({
  users,
}) => {
  const userEntries = Object.entries(users);

  if (userEntries.length === 0) {
    return <Typography>No users found in this cart.</Typography>;
  }

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 1,
          marginTop: 2,
        }}
      >
        {userEntries.map(([userId, userData]) => (
          <Chip key={userId} label={userData.name} />
        ))}
      </Box>
    </div>
  );
};

export default CartUsers;
