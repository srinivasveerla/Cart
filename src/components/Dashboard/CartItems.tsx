/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { database } from "../../auth/firebaseConfig";
import { ref, push, set, remove } from "firebase/database";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useUserContext } from "../../context/UserContext";

const CartItems: React.FC<{ cartId: string; items: Record<string, any> }> = ({
  cartId,
  items,
}) => {
  const [itemName, setItemName] = useState<string>("");
  const [itemQuantity, setItemQuantity] = useState<string>("");
  const { user } = useUserContext();

  const addItem = async () => {
    if (!itemName) {
      alert("Item name is required!");
      return;
    }

    try {
      const itemsRef = ref(database, `carts/${cartId}/items`);
      const newItemRef = push(itemsRef);

      await set(newItemRef, {
        name: itemName,
        quantity: itemQuantity,
        addedBy: user.displayName || "Anonymous",
      });

      setItemName("");
      setItemQuantity("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await remove(ref(database, `carts/${cartId}/items/${itemId}`));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div>
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            size="small"
          />
          <TextField
            label="Quantity"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            size="small"
          />
        </Box>
        <Button variant="contained" onClick={addItem} disabled={!itemName}>
          Add Item
        </Button>
      </Box>

      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {Object.entries(items).map(([id, item]) => (
          <Box
            key={id}
            sx={{
              border: "1px solid #ddd",
              // margin: 1,
              padding: 1,
              borderRadius: 2,
              color: "primary.main",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f9f9f9" },
              // minWidth: "200px",
              textAlign: "center",
            }}
            onDoubleClick={() => removeItem(id)}
          >
            <Typography variant="body2">
              {item.name} {item.quantity !== "" ? `- ${item.quantity}` : ""}
            </Typography>
            {/* <Chip label={item.addedBy} /> */}
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default CartItems;
