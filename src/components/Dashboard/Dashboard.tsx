import React, { useState } from "react";
import CartCreation from "./CartCreation";
import CartJoin from "./CartJoin";
import CartDetails from "./CartDetails";
import Logout from "../auth/Logout";
import { useUserContext } from "../../context/UserContext";
import { Navigate } from "react-router-dom";
import UserCarts from "./UserCarts";
import { Box, Button, Drawer, Typography, styled } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const StyledButton = styled(Button)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  left: theme.spacing(2),
}));

const Dashboard: React.FC = () => {
  const { user } = useUserContext();
  const [cartId, setCartId] = useState<string>("");
  const [open, setOpen] = useState(true);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleCartLeft = () => {
    setCartId(""); // Reset cartId when the user leaves a cart
  };

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ margin: 1 }}>
      <Typography variant="h4" sx={{ color: "primary.main" }}>
        Hi, {user.displayName}
      </Typography>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ marginLeft: 2, marginRight: 2 }} role="presentation">
          <CartCreation onCartCreated={setCartId} />
          <CartJoin onCartJoined={setCartId} />
          <Box
            style={{ flex: 1, marginRight: 20 }}
            onClick={toggleDrawer(false)}
          >
            <UserCarts onSelectCart={setCartId} />
          </Box>
          <Logout />
        </Box>
      </Drawer>
      <Box style={{ flex: 2, padding: 10 }}>
        {cartId ? (
          <CartDetails cartId={cartId} onCartLeft={handleCartLeft} />
        ) : (
          <Typography variant="body1">Select a cart.</Typography>
        )}
      </Box>

      <StyledButton onClick={toggleDrawer(true)}>
        <KeyboardDoubleArrowRightIcon />
      </StyledButton>
    </Box>
  );
};

export default Dashboard;
