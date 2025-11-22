import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { UserProvider } from "./context/UserContext";
import { TodoProvider } from "./context/TodoContext";
import AppRoutes from "./routes/AppRoutes";
import theme from "./theme/theme";

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <UserProvider>
      <TodoProvider>
        <AppRoutes />
      </TodoProvider>
    </UserProvider>
  </ThemeProvider>
);

export default App;
