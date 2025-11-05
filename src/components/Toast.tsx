import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "info" | "success" | "error";
  duration?: number; // auto-close in ms
  onClose?: () => void;
}

export default function Toast({
  message,
  type = "info",
  duration = 2000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const alertClass = {
    info: "alert-info",
    success: "alert-success",
    error: "alert-error",
  }[type];

  return (
    <div className="toast toast-top toast-center z-50">
      <div className={`alert ${alertClass}`}>
        <span>{message}</span>
      </div>
    </div>
  );
}
