// עמוד דוגמה מלא: כך שולפים נתונים עם React Query
// השתמשי בו כתבנית לשאר העמודים

import { useState } from "react";
import { getDishes, getCategories } from "../api/dishes";
import type { DishFilters } from "../api/dishes";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useQuery } from "@tanstack/react-query";
import DishCard from "../components/DishCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function MenuPage() {
const [search, setSearch] = useState("");
const [category, setCategory] = useState("");
const [sort, setSort] = useState<DishFilters["sort"]>("name");

const { data: dishes, isLoading, error } = useQuery({
  queryKey: ["dishes", search, category, sort],
  queryFn: () => getDishes({ search, category, sort }),
  placeholderData: (previous) => previous
});
  
  const {data:categories} = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

{categories?.map((c) => (
  <option key={c} value={c}>{c}</option>
))}

const { user, isAdmin } = useAuth();
const { addItem } = useCart();

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>התפריט שלנו</h1>
<div className="filters">
  {/* חיפוש */}
  <input
    placeholder="חיפוש מנה..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {/* קטגוריה */}
  <select value={category} onChange={(e) => setCategory(e.target.value)}>
    <option value="">כל הקטגוריות</option>
    {categories?.map((c) => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>

  {/* מיון */}
  <select
    value={sort}
    onChange={(e) => setSort(e.target.value as DishFilters["sort"])}
  >
    <option value="name">לפי שם</option>
    <option value="price">מחיר: מהזול ליקר</option>
    <option value="-price">מחיר: מהיקר לזול</option>
  </select>
</div>






      <div className="grid">
        {dishes?.map((dish) => (
          <DishCard
  key={dish._id}
  dish={dish}
  onAdd={user && !isAdmin ? addItem : undefined} />
        ))}
      </div>
    </div>
  );
}
