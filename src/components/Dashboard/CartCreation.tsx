import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { database } from "../../auth/firebaseConfig";
import { get, push, ref, set } from "firebase/database";
import { useUserContext } from "../../context/UserContext";

const CartCreation: React.FC<{ onCartCreated: (cartId: string) => void }> = ({
  onCartCreated,
}) => {
  const [cartName, setCartName] = useState<string>("");
  const { user } = useUserContext();

  const createCart = async () => {
    if (!cartName) return;
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
      const newCartRef = push(ref(database, "carts"));
      await set(newCartRef, {
        name: cartName,
        owner: user.uid,
        users: {
          [user.uid]: {
            name: user.displayName || "Anonymous",
          },
        },
      });
      await set(
        ref(database, `cartsByUser/${user.uid}/${newCartRef.key}`),
        true
      );
      onCartCreated(newCartRef.key!);
      setCartName("");
      alert("Cart created successfully!");
    } catch (error) {
      console.error("Error creating cart:", error);
    }
  };

  return (
    <Box style={{ marginTop: 20 }}>
      <Typography variant="h5">Create a Cart</Typography>
      <TextField
        label="Cart Name"
        value={cartName}
        onChange={(e) => setCartName(e.target.value)}
        size="small"
      />
      <Button
        variant="contained"
        onClick={createCart}
        style={{ marginLeft: 10 }}
        disabled={!cartName}
      >
        Add
      </Button>
    </Box>
  );
};

export default CartCreation;
