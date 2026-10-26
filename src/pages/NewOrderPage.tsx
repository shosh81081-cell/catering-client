import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getOrderOptions, createOrder } from "../api/orders";
import ErrorMessage from "../components/ErrorMessage";

interface OrderForm {
  eventName: string;
  eventDate: string;
  guests: number;
  address: string;
  notes: string;
  paymentMethod: string;
  terms: boolean;
}


export default function NewOrderPage() {
  const { items, total, setQuantity, removeItem, clear } = useCart();

  const { register, handleSubmit, formState: { errors } } = useForm<OrderForm>();
  const navigate = useNavigate();


  const { data: options } = useQuery({
    queryKey: ["orderOptions"],
    queryFn: getOrderOptions
  });
  const mutation = useMutation({
    mutationFn: (form: OrderForm) =>
      createOrder({
        ...form,
        items: items.map((i) => ({ dishId: i.dish._id, quantity: i.quantity }))
      }),
    onSuccess: () => {
      clear();
      navigate("/my-orders");
    }
  });

  const deposit = Math.round(total * (options?.depositRate ?? 0.1));

  // אם הסל ריק, אין מה להזמין
  if (items.length === 0) {
    return (
      <div>
        <h1>הזמנה חדשה</h1>
        <p>הסל ריק. <Link to="/">לבחירת מנות מהתפריט</Link></p>
      </div>
    );
  }


  return (
    <div>
      <h1>הזמנה חדשה</h1>

      <h2>המנות שבחרת</h2>
      <table>
        <thead>
          <tr>
            <th>מנה</th>
            <th>מחיר</th>
            <th>כמות</th>
            <th>סה"כ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ dish, quantity }) => (
            <tr key={dish._id}>
              <td>{dish.name}</td>
              <td>{dish.price} ₪</td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(dish._id, Number(e.target.value))}
                />
              </td>
              <td>{dish.price * quantity} ₪</td>
              <td>
                <button type="button" className="btn-remove" onClick={() => removeItem(dish._id)}>הסר</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p><strong>סה"כ להזמנה: {total} ₪</strong></p>

      <p>מקדמה לתשלום בעת ההזמנה (10%): <strong>{deposit} ₪</strong></p>

      <h2>פרטי האירוע</h2>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <label>שם האירוע</label>
        <input {...register("eventName", { required: "יש להזין שם אירוע" })} />
        {errors.eventName && <span className="error">{errors.eventName.message}</span>}

        <label>תאריך האירוע</label>
        <input
          type="date"
          {...register("eventDate", {
            required: "מתי האירוע שלכם?",
            validate: (v) => new Date(v) > new Date() || "התאריך חייב להיות עתידי"
          })}
        />
        {errors.eventDate && <span className="error">{errors.eventDate.message}</span>}

        <label>מספר האורחים</label>
        <input
          type="number"
          {...register("guests", {
            required: "מספר האורחים המוזמנים",
            valueAsNumber: true,
            min: { value: 1, message: "לפחות אורח אחד" }
          })}
        />
        {errors.guests && <span className="error">{errors.guests.message}</span>}
        <label>כתובת האירוע</label>
        <input {...register("address", { required: "יש להזין כתובת" })} />
        {errors.address && <span className="error">{errors.address.message}</span>}

        <label>הערות</label>
        <textarea {...register("notes")} />

        <label>אמצעי תשלום</label>
        <select {...register("paymentMethod", { required: "יש לבחור אמצעי תשלום" })}>
          <option value="">בחירה...</option>
          {options?.paymentMethods.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}




        </select>
        {errors.paymentMethod && <span className="error">{errors.paymentMethod.message}</span>}


        <p>
          <strong>תקנון:</strong> בעת ההזמנה יש לשלם מקדמה של 10% מסכום ההזמנה.
          ביטול הזמנה אפשרי רק לפני אישורה על ידי הקייטרינג.
        </p>
        <label>
          <input type="checkbox" {...register("terms", { required: "יש לאשר את התקנון" })} />
          קראתי ואני מאשר/ת את התקנון
        </label>
        {errors.terms && <span className="error">{errors.terms.message}</span>}

        {mutation.error && <ErrorMessage error={mutation.error} />}

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "שולח..." : "שליחת הזמנה"}
        </button>

      </form>
    </div>
  );
}