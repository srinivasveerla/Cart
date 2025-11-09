import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { database } from "../../auth/firebaseConfig";
import { ref, set, get } from "firebase/database";
import { useUserContext } from "../../context/UserContext";

const CartJoin: React.FC<{ onCartJoined: (cartId: string) => void }> = ({
  onCartJoined,
}) => {
  const [cartId, setCartId] = useState<string>("");
  const { user } = useUserContext();

  const joinCart = async () => {
    if (!cartId) {
      alert("Please enter a valid cart ID");
      return;
    }

    try {
      const userCartRef = ref(database, `cartsByUser/${user.uid}`);
      const userCartsSnapshot = await get(userCartRef);
      if (userCartsSnapshot.exists()) {
        const userCarts = userCartsSnapshot.val();
        if (Object.keys(userCarts).length >= 3) {
          alert("You cannot be part of more than 3 carts.");
          return;
        }
      }
      const cartRef = ref(database, `carts/${cartId}`);
      const snapshot = await get(cartRef);

      const cartUsers = snapshot.child("users").val();
      if (cartUsers && Object.keys(cartUsers).length >= 5) {
        alert("Cart is full. You cannot join this cart.");
        return;
      }

      if (snapshot.exists()) {
        await set(ref(database, `carts/${cartId}/users/${user.uid}`), {
          name: user.displayName || "Anonymous",
        });
        await set(ref(database, `cartsByUser/${user.uid}/${cartId}`), true);
        onCartJoined(cartId);
        setCartId("");
      } else {
        alert("Cart not found. Please check the ID and try again.");
      }
    } catch (error) {
      console.error("Error joining cart:", error);
      alert("Failed to join the cart. Please try again.");
    }
  };

  return (
    <Box style={{ marginTop: 20 }}>
      <Typography variant="h5">Join a Cart</Typography>
      <TextField
        label="Cart ID"
        value={cartId}
        onChange={(e) => setCartId(e.target.value)}
        size="small"
      />
      <Button
        variant="contained"
        onClick={joinCart}
        style={{ marginLeft: 10 }}
        disabled={!cartId}
      >
        Join
      </Button>
    </Box>
  );
};

export default CartJoin;
