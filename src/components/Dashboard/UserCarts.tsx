import React, { useEffect, useState } from "react";
import { database } from "../../auth/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useUserContext } from "../../context/UserContext";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const UserCarts: React.FC<{ onSelectCart: (cartId: string) => void }> = ({
  onSelectCart,
}) => {
  const { user } = useUserContext();

  const [userCarts, setUserCarts] = useState<
    Array<{ id: string; name: string; itemCount: number }>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;

    const userCartsRef = ref(database, `cartsByUser/${user.uid}`);
    setLoading(true);

    const unsubscribe = onValue(userCartsRef, (snapshot) => {
      if (snapshot.exists()) {
        const cartIds = Object.keys(snapshot.val());

        // Listen to changes for each cart
        const cartListeners = cartIds.map((cartId) => {
          const cartRef = ref(database, `carts/${cartId}`);

          // Add a listener for each cart
          return onValue(
            cartRef,
            (cartSnapshot) => {
              if (cartSnapshot.exists()) {
                const cartData = cartSnapshot.val();
                const itemCount = cartData.items
                  ? Object.keys(cartData.items).length
                  : 0;
                const updatedCart = {
                  id: cartId,
                  name: cartData.name,
                  itemCount,
                };

                // Update or add the cart in the cartsData array
                setUserCarts((prev) => {
                  const index = prev.findIndex((cart) => cart.id === cartId);
                  if (index !== -1) {
                    // Update existing cart
                    const updated = [...prev];
                    updated[index] = updatedCart;
                    return updated;
                  } else {
                    // Add new cart
                    return [...prev, updatedCart];
                  }
                });
              } else {
                // Remove cart if it no longer exists
                setUserCarts((prev) =>
                  prev.filter((cart) => cart.id !== cartId)
                );
              }
            },
            { onlyOnce: false }
          );
        });

        setLoading(false);

        // Cleanup all cart listeners on unmount
        return () => {
          cartListeners.forEach((unsubscribe) => unsubscribe());
        };
      } else {
        setUserCarts([]);
        setLoading(false);
      }
    });

    // Cleanup the main listener on unmount
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <CircularProgress />;
  }

  if (userCarts.length === 0) {
    return <Typography>No carts found for your account.</Typography>;
  }

  return (
    <Box style={{ marginTop: 20 }}>
      <Typography variant="h6">Your Carts:</Typography>
      <List>
        {userCarts.map((cart) => (
          <ListItem
            key={cart.id}
            style={{ border: "1px solid #ddd", marginBottom: 5 }}
            onClick={() => onSelectCart(cart.id)}
          >
            <ListItemText
              sx={{ color: "primary.main" }}
              primary={cart.name}
              secondary={`Items: ${cart.itemCount}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserCarts;
