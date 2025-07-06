// Token utility functions

export const isTokenExpired = () => {
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  if (!tokenExpiry) return true;
  
  return new Date().getTime() > parseInt(tokenExpiry);
};

export const getTokenExpiryTime = () => {
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  if (!tokenExpiry) return null;
  
  return new Date(parseInt(tokenExpiry));
};

export const getTimeUntilExpiry = () => {
  const expiryTime = getTokenExpiryTime();
  if (!expiryTime) return 0;
  
  return expiryTime.getTime() - new Date().getTime();
};

export const formatTimeRemaining = (milliseconds) => {
  if (milliseconds <= 0) return "Expired";
  
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
}; 