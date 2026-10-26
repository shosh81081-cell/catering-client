import type { Dish } from "../types";

interface Props {
  dish: Dish;
  onAdd?: (dish: Dish) => void; // אם מועבר - יוצג כפתור "הוסף להזמנה"
}

export default function DishCard({ dish, onAdd }: Props) {
  return (
    <div className="card">
      {dish.image && <img src={dish.image} alt={dish.name} />}
      <h3>{dish.name}</h3>
      <p>{dish.description}</p>
      <div className="card-footer">
        <strong>{dish.price} ₪</strong>
        {onAdd && <button onClick={() => onAdd(dish)}>הוסף להזמנה</button>}
      </div>
    </div>
  );
}
