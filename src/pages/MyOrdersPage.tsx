import {useQuery , useMutation, useQueryClient } from "@tanstack/react-query";
import {getOrders , cancelOrder } from "../api/orders";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";

export default function MyOrdersPage()
{
  const { data: orders, isLoading, error } = useQuery({
  queryKey: ["orders"],
  queryFn: () => getOrders()
});

const queryClient = useQueryClient();

const cancelMutation = useMutation({
  mutationFn: cancelOrder,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] })
});

if (isLoading) return <Loader />;
if (error) return <ErrorMessage error={error} />;
if (!orders?.length ) {
  return <p>אין לכם הזמנות עדיין</p>
}


  return (
  <div>
    <h1>ההזמנות שלי</h1>
    <table>
      <thead>
        <tr>
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
            <td>{order.eventName}</td>
            <td>{new Date(order.eventDate).toLocaleDateString("he-IL")}</td>
            <td>{order.guests}</td>
            <td>{order.total} ₪</td>
            <td>{order.deposit} ₪ ({order.depositPaid ? "שולמה" : "טרם שולמה"})</td>
            <td>{order.status}</td>
            <td>
              {order.status === "ממתינה לאישור" && (
                <button
                  onClick={() => confirm("לבטל את ההזמנה?") && cancelMutation.mutate(order._id)}
                >
                  ביטול
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

}