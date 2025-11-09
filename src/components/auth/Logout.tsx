import React from "react";
import { useUserContext } from "../../context/UserContext";
import { auth } from "../../auth/firebaseConfig";
import { signOut } from "firebase/auth";
import { Button } from "@mui/material";

const Logout: React.FC = () => {
  const { setUser } = useUserContext();

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Button
      sx={{ width: 80 }}
      variant="contained"
      color="secondary"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default Logout;
