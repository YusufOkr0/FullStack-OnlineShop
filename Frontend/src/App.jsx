import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Navigate'i import ediyoruz
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import MyProfile from "./pages/Profile/MyProfile";
import MyOrders from "./pages/Orders/MyOrders";
import OrderDetail from "./pages/Orders/OrderDetail";
import ProductList from "./pages/Products/ProductList";
import ProductDetail from "./pages/Products/ProductDetail";
import ProductForm from "./pages/Products/ProductForm";
import UserList from "./pages/Users/UserList";
import UserDetail from "./pages/Users/UserDetail";
import UserForm from "./pages/Users/UserForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import OrderList from "./pages/Orders/OrderList";
import ErrorComponent from "./pages/ErrorComponent";
import About from "./pages/Home/About";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          {/* MY ORDERS */}
          <Route
            path="/myOrders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* ORDERS */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <OrderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <OrderDetail />
              </ProtectedRoute>
            }
          />

          {/* PRODUCTS */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route
            path="/products/new"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ProductForm />
              </ProtectedRoute>
            }
          />

          {/* USERS */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/add"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <UserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <UserDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <UserForm />
              </ProtectedRoute>
            }
          />

          {/* NOT FOUND - Anasayfaya yönlendir */}
          <Route
            path="*"
            element={
              <ErrorComponent
                status={500}
                message={
                  "An unexpected error occurred. Please try again later."
                }
                error={"Internal Server Error"}
              />
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
