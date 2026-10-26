export default function ErrorMessage({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "אירעה שגיאה";
  return <div className="error">{message}</div>;
}
