import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";

// s monta una sola vez, en App.tsx
function Toast() {
  const message = useNotificationStore((state) => state.message);
  const show = useNotificationStore((state) => state.show);
  const hideNotification = useNotificationStore((state) => state.hideNotification);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(hideNotification, 3000); // se oculta a los 3 segs
    return () => clearTimeout(timer);
  }, [show, message, hideNotification]); // un mensaje nuevo reinicia el tiempo

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-20 rounded bg-gray-800 px-4 py-2 text-white shadow-lg">
      {message}
    </div>
  );
}

export default Toast;
