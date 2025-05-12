import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Yükleniyor...</div>; // ya da istersen bir spinner
  }

  if (!user) {
    // Eğer kullanıcı giriş yapmamışsa login sayfasına yönlendir
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Kullanıcı, izin verilen rollere sahip değilse, ana sayfaya yönlendir
    return <Navigate to="/" />;
  }

  return children; // Kullanıcı giriş yaptıysa ve yetkiliyse, çocuk bileşeni render et
};

export default ProtectedRoute;
