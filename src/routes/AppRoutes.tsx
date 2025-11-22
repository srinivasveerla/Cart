import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebaseConfig";
import Login from "../components/auth/Login";
import Dashboard from "../components/Dashboard/Dashboard";
import TodoBoard from "../components/TodoBoard/TodoBoard";
import { useUserContext } from "../context/UserContext";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserContext();
  return user ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes: React.FC = () => {
  const { setUser } = useUserContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        console.log("No user signed in");
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/todos"
          element={
            <AuthGuard>
              <TodoBoard />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
