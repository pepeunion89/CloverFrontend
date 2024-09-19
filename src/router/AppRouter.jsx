import { Routes, Route } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { ApplicationRoutes } from "../application/routes/ApplicationRoutes";

export const AppRouter = () => {
  return (
    <Routes>

        {/* Login y Registro */}
        <Route path="/auth/*" element={<AuthRoutes />}/>

         {/* Aplicacion */}
        <Route path="/*" element={<ApplicationRoutes />}/>

    </Routes>
  )
}