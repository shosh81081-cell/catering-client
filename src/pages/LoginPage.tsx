import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";


interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { saveLogin } = useAuth();
  const navigate = useNavigate();

  // 1. react-hook-form מנהל את השדות והוולידציה
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  // 2. useMutation שולח את הבקשה לשרת ומנהל מצב טעינה ושגיאה
  const mutation = useMutation({
    mutationFn: (data: LoginForm) => login(data.email, data.password),
    onSuccess: (data) => {
      saveLogin(data); // שומר טוקן ומשתמש ב-Context
      navigate(data.user.role === "admin" ? "/admin/orders" : "/");
    }
  });

  // 3. handleSubmit מריץ את הוולידציה, ורק אם הכל תקין קורא לפונקציה
  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <h1>כניסה</h1>

      <label>אימייל</label>
      <input
        {...register("email", {
          required: "יש להזין אימייל",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "אימייל לא תקין" }
        })}
      />
      {errors.email && <span className="error">{errors.email.message}</span>}

      <label>סיסמה</label>
      <input
        type="password"
        {...register("password", { required: "יש להזין סיסמה" })}
      />
      {errors.password && <span className="error">{errors.password.message}</span>}

      {mutation.error && <ErrorMessage error={mutation.error} />}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "מתחבר..." : "כניסה"}
      </button>

      <p>אין לך חשבון? <Link to="/register">להרשמה</Link></p>
    </form>
  );
}