import { useState } from "react";
import { Container, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
      alert("User email is missing. Try logging in again.");
      return;
    }

    if (!otp) {
      setError("OTP is required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, email: userEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("OTP Verified! Your account is now active.");
        sessionStorage.removeItem("userEmail");
        navigate("/profile");
      } else {
        setError(data.message || "OTP verification failed.");
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
    }
  };

  const handleResendOtp = async () => {
    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
      alert("User email is missing. Try logging in again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
      } else {
        setError(data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        OTP Verification
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <TextField
        fullWidth
        label="Enter OTP"
        margin="normal"
        value={otp} // Added for value binding
        onChange={(e) => setOtp(e.target.value)}
      />

      <Button variant="contained" color="primary" fullWidth onClick={handleVerifyOtp}>
        Verify OTP
      </Button>

      <Button variant="outlined" color="secondary" fullWidth onClick={handleResendOtp} style={{ marginTop: "10px" }}>
        Resend OTP
      </Button>

      <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage(null)}>
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </Container>
  );
}