import React, { useState } from "react";
import CartCreation from "./CartCreation";
import CartJoin from "./CartJoin";
import CartDetails from "./CartDetails";
import Logout from "../auth/Logout";
import { useUserContext } from "../../context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import UserCarts from "./UserCarts";
import { Box, Button, Drawer, Typography, styled, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const StyledButton = styled(Button)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  left: theme.spacing(2),
}));

const Dashboard: React.FC = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
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
        <Box sx={{ width: 280, p: 2 }} role="presentation">
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            Navigation
          </Typography>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/todos'); toggleDrawer(false)(); }}>
                <ListItemIcon>
                  <ChecklistIcon />
                </ListItemIcon>
                <ListItemText primary="My Todos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/dashboard'); }}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Shopping Carts" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
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
