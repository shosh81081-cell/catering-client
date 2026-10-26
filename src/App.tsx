// כל הנתיבים (Routes) של האתר במקום אחד
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NewOrderPage from "./pages/NewOrderPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import AdminDishesPage from "./pages/admin/AdminDishesPage";
import DishFormPage from "./pages/admin/DishFormPage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* פתוח לכולם */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/" element={<MenuPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* משתמש מחובר */}
        <Route element={<ProtectedRoute />}>
          <Route path="/order" element={<NewOrderPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
        </Route>

        {/* מנהל בלבד */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetailsPage />} />
          <Route path="/admin/dishes" element={<AdminDishesPage />} />
          <Route path="/admin/dishes/new" element={<DishFormPage />} />
          <Route path="/admin/dishes/:id" element={<DishFormPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
