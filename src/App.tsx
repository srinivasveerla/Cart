import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { UserProvider } from "./context/UserContext";
import AppRoutes from "./routes/AppRoutes";
import theme from "./theme/theme";

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  </ThemeProvider>
);

export default App;
