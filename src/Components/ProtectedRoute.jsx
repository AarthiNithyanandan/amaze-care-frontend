import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../utils/auth";

const ProtectedRoute = ({ children, role: requiredRole }) => {
  const token = getToken();
  const role = getRole();

  if (!token || (requiredRole && role !== requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
