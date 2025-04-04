import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { CssBaseline, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme.ts";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar.tsx";
import HomePage from "./pages/HomePage.tsx";
import Changepassword from "./pages/Changepassword.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import AdminPage from "./pages/AdminPage.tsx"; // Import AdminPage

export default function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuth && <Navbar isAuth={isAuth} setAuth={setIsAuth} />}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: isAuth ? "flex-start" : "center",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
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
          <Route
            path="/profile"
            element={isAuth ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={isAuth ? <AdminPage /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}