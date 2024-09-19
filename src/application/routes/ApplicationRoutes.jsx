import { Navigate, Route, Routes } from "react-router-dom";
import { ApplicationPage } from "../pages/ApplicationPage";


export const ApplicationRoutes = () => {
  return (
    <>
        <Routes>

            <Route path="/" element={<ApplicationPage />} />

            <Route path="/*" element={<Navigate to={"/"} />} />
            
        </Routes>
    </>
  )
}