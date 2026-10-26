import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div>
      <h1>העמוד לא נמצא</h1>
      <Link to="/">חזרה לתפריט</Link>
    </div>
  );
}
