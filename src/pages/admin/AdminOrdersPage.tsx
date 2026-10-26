import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrderOptions, updateOrder } from "../../api/orders";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";

export default function AdminOrdersPage() {
  // סינון לפי סטטוס ("" = כל ההזמנות)
  const [status, setStatus] = useState("");

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders", status],
    queryFn: () => getOrders(status),
    placeholderData: (previous) => previous
  });

  // רשימת הסטטוסים מהשרת
  const { data: options } = useQuery({
    queryKey: ["orderOptions"],
    queryFn: getOrderOptions
  });

  const queryClient = useQueryClient();

  // עדכון סטטוס של הזמנה
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrder(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] })
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>ניהול הזמנות</h1>

      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">כל ההזמנות</option>
          {options?.statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {updateMutation.error && <ErrorMessage error={updateMutation.error} />}

      {!orders?.length ? (
        <p>אין הזמנות להצגה</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>לקוח</th>
              <th>אירוע</th>
              <th>תאריך</th>
              <th>אורחים</th>
              <th>סה"כ</th>
              <th>מקדמה</th>
              <th>סטטוס</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  {order.user.name}
                  <br />
                  {order.user.phone}
                </td>
                <td>{order.eventName}</td>
                <td>{new Date(order.eventDate).toLocaleDateString("he-IL")}</td>
                <td>{order.guests}</td>
                <td>{order.total} ₪</td>
                <td>{order.deposit} ₪ ({order.depositPaid ? "שולמה" : "טרם שולמה"})</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateMutation.mutate({ id: order._id, status: e.target.value })}
                  >
                    {options?.statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <Link to={`/admin/orders/${order._id}`}>פרטים</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}