import { useState } from "react";
import { Container, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
      setErrorMessage("User email not found. Please start over.");
      navigate("/forgot-password");
      return;
    }

    // Validation
    if (!otp) {
      setErrorMessage("OTP is required.");
      return;
    }
    if (!newPassword) {
      setErrorMessage("New password is required.");
      return;
    }
    if (!confirmPassword) {
      setErrorMessage("Confirm password is required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      // First, verify the OTP
      const verifyResponse = await fetch("http://localhost:3000/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, otp }),
      });

      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        setErrorMessage(verifyData.message || "Invalid OTP.");
        return;
      }

      // Then, reset the password
      const resetResponse = await fetch("http://localhost:3000/user/resetpwd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, newpwd: newPassword }),
      });

      const resetData = await resetResponse.json();
      if (resetResponse.ok) {
        setSuccessMessage("Password reset successfully. You can now log in.");
        sessionStorage.removeItem("userEmail"); // Clear email after success
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2s
      } else {
        setErrorMessage(resetData.message || "Failed to reset password.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom textAlign="center">
        Reset Password
      </Typography>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <TextField
        fullWidth
        label="Enter OTP"
        margin="normal"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <TextField
        fullWidth
        label="New Password"
        type="password"
        margin="normal"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <TextField
        fullWidth
        label="Confirm New Password"
        type="password"
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleResetPassword}
        style={{ marginTop: "10px" }}
      >
        Reset Password
      </Button>

      <Button
        color="secondary"
        fullWidth
        onClick={() => navigate("/forgot-password")}
        style={{ marginTop: "10px" }}
      >
        Back to Forgot Password
      </Button>
    </Container>
  );
};

export default ResetPasswordPage;