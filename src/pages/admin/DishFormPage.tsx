import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDish, getCategories, createDish, updateDish } from "../../api/dishes";
import type { DishInput } from "../../types";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";

const emptyDish: DishInput = {
  name: "",
  description: "",
  category: "",
  price: 0,
  image: "",
  available: true,
  ingredients: []
};

export default function DishFormPage() {
  // בכתובת /admin/dishes/new אין id, ובכתובת /admin/dishes/:id יש
  const { id } = useParams();
  const isEdit = id !== undefined;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<DishInput>({
    defaultValues: emptyDish
  });

  // רשימה דינמית של מצרכים: אפשר להוסיף ולהסיר שורות
  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  // במצב עריכה בלבד: שליפת המנה הקיימת
  const { data: dish, isLoading, error } = useQuery({
    queryKey: ["dish", id],
    queryFn: () => getDish(id!),
    enabled: isEdit // לא שולפים כשמוסיפים מנה חדשה
  });

  // כשהמנה מגיעה מהשרת, ממלאים בה את הטופס
  useEffect(() => {
    if (dish) {
      reset({
        name: dish.name,
        description: dish.description,
        category: dish.category,
        price: dish.price,
        image: dish.image,
        available: dish.available,
        ingredients: dish.ingredients
      });
    }
  }, [dish, reset]);

  const mutation = useMutation({
    mutationFn: (data: DishInput) => (isEdit ? updateDish(id!, data) : createDish(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      queryClient.invalidateQueries({ queryKey: ["dish", id] });
      navigate("/admin/dishes");
    }
  });

  if (isEdit && isLoading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <Link to="/admin/dishes">חזרה לניהול מנות</Link>
      <h1>{isEdit ? "עריכת מנה" : "מנה חדשה"}</h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <label>שם המנה</label>
        <input {...register("name", { required: "יש להזין שם" })} />
        {errors.name && <span className="error">{errors.name.message}</span>}

        <label>תיאור</label>
        <textarea {...register("description")} />

        <label>קטגוריה</label>
        <select {...register("category", { required: "יש לבחור קטגוריה" })}>
          <option value="">בחירה...</option>
          {categories?.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <span className="error">{errors.category.message}</span>}

        <label>מחיר למנה (₪)</label>
        <input
          type="number"
          step="any"
          {...register("price", {
            required: "יש להזין מחיר",
            valueAsNumber: true,
            min: { value: 0.01, message: "המחיר חייב להיות חיובי" }
          })}
        />
        {errors.price && <span className="error">{errors.price.message}</span>}

        <label>כתובת תמונה (לא חובה)</label>
        <input {...register("image")} placeholder="https://..." />

        <label>
          <input type="checkbox" {...register("available")} />
          זמינה להזמנה
        </label>

        <h2>מצרכים למנה אחת</h2>
        {fields.map((field, index) => (
          <div key={field.id} className="filters">
            <input
              placeholder="שם המצרך"
              {...register(`ingredients.${index}.name`, { required: true })}
            />
            <input
              type="number"
              step="any"
              placeholder="כמות"
              {...register(`ingredients.${index}.amount`, { required: true, valueAsNumber: true })}
            />
            <input
              placeholder='יחידה (ק"ג, ליטר...)'
              {...register(`ingredients.${index}.unit`, { required: true })}
            />
            <button type="button" onClick={() => remove(index)}>הסר</button>
          </div>
        ))}
        {errors.ingredients && <span className="error">יש למלא את כל פרטי המצרכים</span>}

        <button type="button" onClick={() => append({ name: "", amount: 0, unit: 'ק"ג' })}>
          + הוספת מצרך
        </button>

        {mutation.error && <ErrorMessage error={mutation.error} />}

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "שומר..." : "שמירה"}
        </button>
      </form>
    </div>
  );
}