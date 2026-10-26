import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import {register as registerUser  } from "../api/auth";

interface RegisterForm
{
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage()
{
  const {saveLogin} = useAuth();
  const navigate = useNavigate();
  const {register, handleSubmit, watch, formState:{errors}} = useForm<RegisterForm>();
  const mutation = useMutation({
  mutationFn: ({ confirmPassword, ...data }: RegisterForm) => registerUser(data),
  onSuccess: (data) => {
    saveLogin(data);
    navigate("/");
  }
});


  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <h1>הרשמה</h1>

      <label>שם מלא</label>
      <input {...register("name", { required: "יש להזין שם" })} />
      {errors.name && <span className="error">{errors.name.message}</span>}

     <label>אימייל</label>
      <input
        {...register("email", {
          required: "יש להזין אימייל",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "אימייל לא תקין" }
        })}
      />
      {errors.email && <span className="error">{errors.email.message}</span>}

      

      {mutation.error && <ErrorMessage error={mutation.error} />}
      <label>טלפון</label>
<input {...register("phone", {
  required: "יש להזין טלפון",
  pattern: { value: /^0\d{1,2}-?\d{7}$/, message: "טלפון לא תקין" }
})} />
{errors.phone && <span className="error">{errors.phone.message}</span>}
      <label>סיסמה</label>
      <input
        type="password"
        {...register("password", { required: "יש להזין סיסמה" , 
          minLength:{value:6, message:"לפחות 6 תווים"}
        })}
      />
      {errors.password && <span className="error">{errors.password.message}</span>}
      
      <label>אימות סיסמה</label>
      <input
        type="password"
        {...register("confirmPassword", { required: "יש להזין אימות סיסמה", 
          validate: (value)=>value === watch ("password") || "הסיסמאות אינן תואמות" })}
      />
      {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}


      {mutation.error && <ErrorMessage error={mutation.error} />}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "נרשם..." : "הרשמה"}
      </button>

      <p>יש לך חשבון? <Link to="/login">כניסה</Link></p>
    </form>
  );
}