import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar.tsx";
import HomePage from "./pages/HomePage.tsx";
import Changepassword from "./pages/Changepassword.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";


export default function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  return (
    <>
      <Navbar isAuth={isAuth} setAuth={setIsAuth} />
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage setAuth={setIsAuth} />} />
        <Route path="/otp-verification" element={<OtpVerificationPage />} />
        <Route path="/changepassword" element={<Changepassword />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/homepage"
          element={isAuth ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route path="/profile" element={ <ProfilePage />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}
