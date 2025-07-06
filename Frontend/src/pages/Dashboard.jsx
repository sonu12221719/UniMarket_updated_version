import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { formatTimeRemaining, getTimeUntilExpiry } from "../utils/tokenUtils";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const updateTimeRemaining = () => {
      const remaining = getTimeUntilExpiry();
      setTimeRemaining(formatTimeRemaining(remaining));
      
      // If token is expired, logout
      if (remaining <= 0) {
        logout();
        navigate("/login");
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [logout, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard - Protected Route</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Session: {timeRemaining}</span>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      {user && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Welcome, {user.firstName}!</h2>
          <p>Email: {user.email}</p>
          <p>University: {user.university}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
