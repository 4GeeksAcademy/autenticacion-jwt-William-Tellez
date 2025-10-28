import { Navigate, Outlet } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const PrivateRoute = ({ allowedRoles }) => {
  const { store: { user } } = useGlobalReducer();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <h1>Not authorized</h1>;
  }

  return <Outlet />; // Renderiza la ruta hija protegida
};

export default PrivateRoute;