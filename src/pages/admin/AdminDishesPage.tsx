import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDishes, deleteDish } from "../../api/dishes";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";

export default function AdminDishesPage() {
  const queryClient = useQueryClient();

  const { data: dishes, isLoading, error } = useQuery({
    queryKey: ["dishes"],
    queryFn: () => getDishes()
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDish,
    // מרענן את כל השאילתות שמתחילות ב-"dishes", כולל אלה של התפריט
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dishes"] })
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>ניהול מנות</h1>

      <Link to="/admin/dishes/new">
        <button>+ מנה חדשה</button>
      </Link>

      {deleteMutation.error && <ErrorMessage error={deleteMutation.error} />}

      <table>
        <thead>
          <tr>
            <th>שם</th>
            <th>קטגוריה</th>
            <th>מחיר</th>
            <th>זמינה</th>
            <th>מצרכים</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dishes?.map((dish) => (
            <tr key={dish._id}>
              <td>{dish.name}</td>
              <td>{dish.category}</td>
              <td>{dish.price} ₪</td>
              <td>{dish.available ? "כן" : "לא"}</td>
              <td>{dish.ingredients.length}</td>
              <td>
                <Link to={`/admin/dishes/${dish._id}`}>עריכה</Link>{" "}
                <button
                  className="btn-remove"
                  onClick={() =>
                    confirm(`למחוק את "${dish.name}"?`) && deleteMutation.mutate(dish._id)
                  }
                >
                  מחיקה
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}