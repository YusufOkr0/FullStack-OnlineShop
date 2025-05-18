import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorComponent from "../pages/ErrorComponent";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // ya da istersen bir spinner
  }

  if (!user) {
    // Eğer kullanıcı giriş yapmamışsa login sayfasına yönlendir
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Kullanıcı, izin verilen rollere sahip değilse, ana sayfaya yönlendir
    return (
      <ErrorComponent
        status={403}
        message="Access denied. Please authenticate with a valid token."
        error="Unauthorized"
      />
    );
  }

  return children; // Kullanıcı giriş yaptıysa ve yetkiliyse, çocuk bileşeni render et
};

export default ProtectedRoute;
