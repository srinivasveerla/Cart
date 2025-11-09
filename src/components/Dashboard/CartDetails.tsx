/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { database } from "../../auth/firebaseConfig";
import { ref, onValue, remove } from "firebase/database";
import CartUsers from "./CartUsers";
import CartItems from "./CartItems";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Snackbar,
  Typography,
} from "@mui/material";
import { useUserContext } from "../../context/UserContext";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const CartDetails: React.FC<{ cartId: string; onCartLeft: () => void }> = ({
  cartId,
  onCartLeft,
}) => {
  const [cartData, setCartData] = useState<any>(null);
  const { user } = useUserContext();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cartId);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const leaveCart = async () => {
    try {
      // Remove user from the cart
      await remove(ref(database, `carts/${cartId}/users/${user.uid}`));
      // Remove the cart reference from the user's list of carts
      await remove(ref(database, `cartsByUser/${user.uid}/${cartId}`));
      alert("You have successfully left the cart.");
      onCartLeft(); // Notify parent component (Dashboard) to reset cartId
    } catch (error) {
      console.error("Error leaving cart:", error);
      alert("Failed to leave the cart. Please try again.");
    }
  };

  useEffect(() => {
    if (!cartId) return;

    const cartRef = ref(database, `carts/${cartId}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      setCartData(snapshot.val());
    });
    return () => unsubscribe();
  }, [cartId]);

  const deleteCart = async () => {
    if (cartData?.owner !== user.uid) {
      return;
    }

    try {
      await remove(ref(database, `cartsByUser/${user.uid}/${cartId}`));
      await remove(ref(database, `carts/${cartId}`));
      alert("Cart deleted successfully!");
      onCartLeft(); // Notify parent component (Dashboard) to reset cartId
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  };

  if (!cartData) {
    return <p>Select a Cart....</p>;
  }

  return (
    <Box style={{ marginTop: 20, border: "1px solid #ccc", padding: 10 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ textAlign: "center", color: "primary.main" }}
      >
        {cartData.name}
      </Typography>
      <CartItems cartId={cartId} items={cartData.items || {}} />
      <Button
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mt: 2 }}
        onClick={toggleExpand}
        endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      >
        {isExpanded ? "Hide Cart Details" : "Show Cart Details"}
      </Button>
      <Collapse in={isExpanded}>
        {cartData.owner === user.uid && (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={handleCopy}
              endIcon={<ContentCopyIcon fontSize="small" />}
            >
              Copy Id to Share
            </Button>
            <Button variant="outlined" color="error" onClick={deleteCart}>
              Delete Cart
            </Button>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                sx={{ width: "100%" }}
              >
                Cart ID copied to clipboard!
              </Alert>
            </Snackbar>
          </Box>
        )}
        {cartData.owner !== user.uid && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={leaveCart}
              fullWidth
            >
              Leave Cart
            </Button>
          </Box>
        )}
        <CartUsers users={cartData.users} />
      </Collapse>
    </Box>
  );
};

export default CartDetails;
