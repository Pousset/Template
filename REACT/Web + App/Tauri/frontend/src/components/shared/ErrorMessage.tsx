interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p
      className="text-xs text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2"
      role="alert"
    >
      {message}
    </p>
  );
}
