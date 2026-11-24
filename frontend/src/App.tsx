import { useEffect } from "react";
import AppRouter from "@/routes/AppRouter";
import { useAuthStore } from "@/store/authStore";

function App() {
  const checkSession = useAuthStore((s) => s.checkSession);

  // única llamada en useEffect: confirmar la sesión al montar la aplicación
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return <AppRouter />;
}

export default App;