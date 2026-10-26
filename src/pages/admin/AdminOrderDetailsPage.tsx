import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrder, getShoppingList, updateOrder } from "../../api/orders";
import type { ExtraItem } from "../../types";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";

export default function AdminOrderDetailsPage() {
  // המזהה של ההזמנה מתוך הכתובת: /admin/orders/:id
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id!)
  });

  const { data: list } = useQuery({
    queryKey: ["shoppingList", id],
    queryFn: () => getShoppingList(id!)
  });

  // טופס להוספת פריט קנייה נוסף
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExtraItem>({
    defaultValues: { unit: "יחידות" }
  });

  // עדכון ההזמנה (מקדמה או פריטים נוספים), ואחריו רענון כל הנתונים הקשורים
  const updateMutation = useMutation({
    mutationFn: (data: { depositPaid?: boolean; extraItems?: ExtraItem[] }) => updateOrder(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["shoppingList", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;
  if (!order) return null;

  const addExtraItem = (item: ExtraItem) => {
    updateMutation.mutate({ extraItems: [...order.extraItems, item] });
    reset({ name: "", amount: undefined, unit: "יחידות" });
  };

  const removeExtraItem = (itemId?: string) => {
    updateMutation.mutate({ extraItems: order.extraItems.filter((i) => i._id !== itemId) });
  };

  return (
    <div>
      <Link to="/admin/orders" className="no-print">חזרה לרשימת ההזמנות</Link>

      <h1>{order.eventName}</h1>

      {/* פרטי ההזמנה */}
      <section className="no-print">
        <p>לקוח: {order.user.name} | {order.user.phone} | {order.user.email}</p>
        <p>
          תאריך: {new Date(order.eventDate).toLocaleDateString("he-IL")} |
          אורחים: {order.guests} | כתובת: {order.address}
        </p>
        {order.notes && <p>הערות: {order.notes}</p>}
        <p>סטטוס: {order.status} | אמצעי תשלום: {order.paymentMethod}</p>
        <p>
          סה"כ: {order.total} ₪ | מקדמה: {order.deposit} ₪
        </p>
        <label>
          <input
            type="checkbox"
            checked={order.depositPaid}
            onChange={(e) => updateMutation.mutate({ depositPaid: e.target.checked })}
          />
          המקדמה שולמה
        </label>

        <h2>מנות בהזמנה</h2>
        <table>
          <thead>
            <tr><th>מנה</th><th>כמות</th><th>מחיר</th><th>סה"כ</th></tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.dish}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price} ₪</td>
                <td>{item.price * item.quantity} ₪</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* רשימת קניות */}
      <h2>רשימת קניות</h2>
      <button className="no-print" onClick={() => window.print()}>הדפסת רשימת הקניות</button>

      <table>
        <thead>
          <tr><th>מצרך</th><th>כמות</th><th>יחידה</th></tr>
        </thead>
        <tbody>
          {list?.ingredients.map((ing) => (
            <tr key={`${ing.name}-${ing.unit}`}>
              <td>{ing.name}</td>
              <td>{ing.amount}</td>
              <td>{ing.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>פריטים נוספים</h3>
      {order.extraItems.length === 0 && <p>אין פריטים נוספים</p>}
      <ul>
        {order.extraItems.map((item) => (
          <li key={item._id}>
            {item.name}: {item.amount} {item.unit}{" "}
            <button className="no-print" onClick={() => removeExtraItem(item._id)}>הסר</button>
          </li>
        ))}
      </ul>

      {/* טופס הוספת פריט נוסף */}
      <form className="no-print" onSubmit={handleSubmit(addExtraItem)}>
        <label>שם הפריט</label>
        <input {...register("name", { required: "יש להזין שם פריט" })} />
        {errors.name && <span className="error">{errors.name.message}</span>}

        <label>כמות</label>
        <input
          type="number"
          step="any"
          {...register("amount", {
            required: "יש להזין כמות",
            valueAsNumber: true,
            min: { value: 0.01, message: "כמות חייבת להיות חיובית" }
          })}
        />
        {errors.amount && <span className="error">{errors.amount.message}</span>}

        <label>יחידה</label>
        <input {...register("unit")} />

        {updateMutation.error && <ErrorMessage error={updateMutation.error} />}
        <button type="submit" disabled={updateMutation.isPending}>הוספת פריט</button>
      </form>
    </div>
  );
}