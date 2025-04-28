type AlertProps = {
  message: string;
  variant?: "error" | "success" | "warning" | "info";
  className?: string;
};

function Alert({ message, variant = "error", className = "" }: AlertProps) {
  const variants = {
    error: "bg-red-100 text-red-800 border-red-400",
    success: "bg-green-100 text-green-800 border-green-400",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
    info: "bg-blue-100 text-blue-800 border-blue-400",
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-md ${variants[variant]} ${className}`}
      role="alert"
    >
      <p className="font-medium">{message}</p>
    </div>
  );
}

export { Alert };
