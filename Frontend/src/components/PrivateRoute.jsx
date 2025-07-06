import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  // If no user after loading finishes, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If user exists, render children
  return children;
};

export default PrivateRoute;
