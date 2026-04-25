import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getPrimaryRole } from "../utils/constants";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = getPrimaryRole(user);
  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
