import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SignupIllustration from "../components/SignupIllustration"; // Reuse the illustration component

interface LoginPageProps {
  setAuth: (isAuth: boolean) => void;
}

export default function LoginPage({ setAuth }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("userEmail")) {
      setAuth(true);
      navigate("/profile");
    }
  }, [setAuth, navigate]);

  const handleLogin = async () => {
    setError(""); // Clear previous errors


    

    // Basic validation
    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("userEmail", email);
        setAuth(true);
        navigate("/homepage");
      } else {
        setError(data.message || "Login failed. Try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // Stack on mobile, side-by-side on desktop
        bgcolor: "background.default",
      }}
    >
      {/* Left Side: Illustration */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" }, // Hide on mobile
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#e3f2fd", // Light blue background
          p: 6,
        }}
      >
        <SignupIllustration width="80%" />
      </Box>

      {/* Right Side: Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 3, md: 6 },
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ maxWidth: 600, width: "100%" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Login
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Access your platform for managing cases & clients
          </Typography>
          {error && (
            <Typography color="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Email Address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Password *"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{ mb: 4 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{ py: 1.5, fontSize: "1.1rem", mb: 3 }}
          >
            Login
          </Button>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            <Link
              component="button"
              onClick={() => navigate("/forgot-password")}
              sx={{ color: "primary.main", textDecoration: "none", fontWeight: "bold" }}
            >
              Forgot Password?
            </Link>
          </Typography>
          <Typography variant="body2" align="center">
            Don’t have an account?{" "}
            <Link
              component="button"
              onClick={() => navigate("/signup")}
              sx={{ color: "primary.main", textDecoration: "none", fontWeight: "bold" }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}