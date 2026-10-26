import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // TODO: להוסיף מונה פריטים בסל (useCart)
  return (
    <nav className="navbar">
      <NavLink to="/">תפריט</NavLink>

      {user && !isAdmin && (
        <>
          <NavLink to="/order">הזמנה חדשה</NavLink>
          <NavLink to="/my-orders">ההזמנות שלי</NavLink>
        </>
      )}

      {isAdmin && (
        <>
          <NavLink to="/admin/orders">ניהול הזמנות</NavLink>
          <NavLink to="/admin/dishes">ניהול מנות</NavLink>
        </>
      )}

      <span className="spacer" />

      {user ? (
        <>
          <span>שלום, {user.name}</span>
          <button onClick={handleLogout}>יציאה</button>
        </>
      ) : (
        <>
          <NavLink to="/login">כניסה</NavLink>
          <NavLink to="/register">הרשמה</NavLink>
        </>
      )}
    </nav>
  );
}
