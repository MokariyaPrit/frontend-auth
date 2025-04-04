import { useState } from "react";
import { Container, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Email is required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/forgotpwd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("OTP sent to your email. Please check and reset your password.");
        sessionStorage.setItem("userEmail", email); // Store email for reset
        setTimeout(() => navigate("/reset-password"), 2000); // Redirect after 2s
      } else {
        setErrorMessage(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom textAlign="center">
        Forgot Password
      </Typography>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <TextField
        fullWidth
        label="Enter your email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleForgotPassword}
        style={{ marginTop: "10px" }}
      >
        Send OTP
      </Button>

      <Button
        color="secondary"
        fullWidth
        onClick={() => navigate("/login")}
        style={{ marginTop: "10px" }}
      >
        Back to Login
      </Button>
    </Container>
  );
};

export default ForgotPasswordPage;