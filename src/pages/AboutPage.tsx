import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, createReview, deleteReview } from "../api/reviews";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";

interface ReviewForm {
    rating: number;
    text: string;
}

// מציג דירוג ככוכבים, למשל 4 → ★★★★☆
const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

export default function AboutPage() {
    const { user, isAdmin } = useAuth();
    const queryClient = useQueryClient();

    const { data: reviews, isLoading, error } = useQuery({
        queryKey: ["reviews"],
        queryFn: getReviews
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewForm>({
        defaultValues: { rating: 5, text: "" }
    });

    const addMutation = useMutation({
        mutationFn: createReview,
        onSuccess: () => {
            reset();
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteReview,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] })
    });

    return (
        <div className="about-page">
            {/* קצת עלינו */}
            <section className="about-intro">
                <h1>קצת עלינו</h1>
                <p>
                    "אירוע בטעם" מקפיץ אירועים כבר 8 שנים, עם אוכל ביתי, טרי ואיכותי.
                    <p>אנחנו מתמחים בהגשה של מנות חמות, סלטים, קינוחים, לחמים, פיתות, בשרים ועוד.</p>
                </p>
                <p>
                    המטבח שלנו מכין כל מנה ביום האירוע, מחומרי גלם נבחרים, ובכשרות מהודרת.
                    <p>אנו מצטיינים במיוחד בהגשת המוצרים בצורה אסטטית ונעימה באריזה שמורה ומוקפדת.</p>
                    <p> יש לנו צוות מלצרים יראי שמיים מהירים ויעילים.</p>
                    <p>מחכים לכם.</p>
                    <p>בשמחות:)</p>

                    <div className=""></div><div className="
          "></div>
                </p>
            </section>

            {/* תגובות */}
            <section>
                <h2>מה הלקוחות שלנו אומרים</h2>

                {isLoading && <Loader />}
                {error && <ErrorMessage error={error} />}
                {reviews?.length === 0 && <p>עדיין אין תגובות. היו הראשונים להגיב!</p>}

                <div className="reviews">
                    {reviews?.map((r) => (
                        <div key={r._id} className="review">
                            <div className="review-head">
                                <strong>{r.name}</strong>
                                <span className="stars">{stars(r.rating)}</span>
                            </div>
                            <p>{r.text}</p>
                            <div className="review-foot">
                                <small>{new Date(r.createdAt).toLocaleDateString("he-IL")}</small>
                                {isAdmin && (
                                    <button
                                        className="btn-remove"
                                        onClick={() => confirm("למחוק את התגובה?") && deleteMutation.mutate(r._id)}
                                    >
                                        מחיקה
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* טופס תגובה - ללקוח מחובר בלבד */}
            <section>
                <h2>הוספת תגובה</h2>
                {user ? (
                    <form onSubmit={handleSubmit((data) => addMutation.mutate(data))}>
                        <label>דירוג</label>
                        <select {...register("rating", { valueAsNumber: true })}>
                            {[5, 4, 3, 2, 1].map((n) => (
                                <option key={n} value={n}>{stars(n)}</option>
                            ))}
                        </select>

                        <label>התגובה שלך</label>
                        <textarea
                            {...register("text", {
                                required: "יש לכתוב תגובה",
                                maxLength: { value: 500, message: "עד 500 תווים" }
                            })}
                        />
                        {errors.text && <span className="error">{errors.text.message}</span>}

                        {addMutation.error && <ErrorMessage error={addMutation.error} />}
                        <button type="submit" disabled={addMutation.isPending}>
                            {addMutation.isPending ? "שולח..." : "שליחת תגובה"}
                        </button>
                    </form>
                ) : (
                    <p>
                        כדי להוסיף תגובה, <Link to="/login">יש להתחבר</Link>.
                    </p>
                )}
            </section>
        </div>
    );
}