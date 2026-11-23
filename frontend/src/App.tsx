import { useEffect } from "react";
import { useAuthStore } from "@/features/auth";
import AppRouter from "@/routes/AppRouter";
import Toast from "@/shared/components/Toast";

// Vrifica la sesión al iniciar, monta el AppRouter y Toast
function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  );
}

export default App;
