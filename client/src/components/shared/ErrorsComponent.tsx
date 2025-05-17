export default function ErrorsComponent({
  error,
  className,
}: {
  error: string;
  className?: string;
}) {
  return (
    <p className={`${className} text-xs opacity-70 mt-2 ml-2 text-red-600`}>
      {error}
    </p>
  );
}
