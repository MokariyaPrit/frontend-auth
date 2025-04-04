import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("userEmail", email); // Store email for authentication
        setAuth(true);
        navigate("/homepage"); // Redirect to homepage
      } else {
        setError(data.message || "Login failed. Try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        style={{ marginTop: "10px" }}
      >
        Login
      </Button>
      <Button
        color="secondary"
        fullWidth
        onClick={() => navigate("/forgot-password")}
        style={{ marginTop: "10px" }}
      >
        Forgot Password?
      </Button>
      <Button
        color="secondary"
        fullWidth
        onClick={() => navigate("/signup")}
        style={{ marginTop: "10px" }}
      >
        Go to Signup
      </Button>
    </Container>
  );
}