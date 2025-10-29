export function ErrorMessage({
  message = "An error occurred",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      {message}
    </div>
  );
}
