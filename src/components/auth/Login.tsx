import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, provider } from "../../auth/firebaseConfig";
import { useUserContext } from "../../context/UserContext";

const Login: React.FC = () => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        navigate("/dashboard");
      })
      .catch((error) => console.error("Login Error:", error));
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Centers items vertically in the box
        justifyContent: "center", // Centers vertically on the screen
        alignItems: "center", // Centers horizontally on the screen
        minHeight: "100vh", // Ensures the box takes up the full viewport height
        width: "100vw", // Ensures the box takes up the full viewport width
      }}
    >
      <Typography variant="h5" gutterBottom>
        Welcome to the Cart App
      </Typography>{" "}
      {/* Added variant and gutterBottom for better spacing */}
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login with Google
      </Button>
    </Box>
  );
};

export default Login;
