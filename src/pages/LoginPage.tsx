import { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, Link, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SignupIllustration from "../components/SignupIllustration";

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
    setError("");

    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

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
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        bgcolor: "background.default",
      }}
    >
      {/* Left Side: Illustration */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
          bgcolor: alpha('#2563eb', 0.1), // Subtle blue tint
          p: 4,
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
        }}
      >
        <Box sx={{ maxWidth: 400, width: "100%" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Login
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Access your platform for managing cases & clients
          </Typography>
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{ mb: 4 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{ py: 1.5, mb: 3 }}
          >
            Login
          </Button>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            <Link
              component="button"
              onClick={() => navigate("/forgot-password")}
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              Forgot Password?
            </Link>
          </Typography>
          <Typography variant="body2" align="center">
            Don’t have an account?{" "}
            <Link
              component="button"
              onClick={() => navigate("/signup")}
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}