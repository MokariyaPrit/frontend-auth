import { useState, useEffect } from "react";
import { Button, TextField, Typography, Container, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Changepassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userEmail = sessionStorage.getItem("userEmail");
      if (!userEmail) {
        setPasswordError("User email not found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/user/profile?email=${userEmail}`);
        const data = await response.json();

        if (response.ok && data.user) {
          setEmail(data.user.email);
        } else {
          setPasswordError("Failed to fetch profile data.");
        }
      } catch (error) {
        setPasswordError("Something went wrong while fetching profile. Try again.");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChangePassword = async () => {
    setPasswordSuccess("");
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (!email) {
      setPasswordError("Email not available. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/changepwd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: currentPassword, newpwd: newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setPasswordSuccess(data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        setPasswordError(data.message || "Failed to change password.");
      }
    } catch (error) {
      setPasswordError("Something went wrong. Try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" textAlign="center" mt={4}>
        Change Password
      </Typography>

      {passwordError && <Alert severity="error">{passwordError}</Alert>}
      {passwordSuccess && <Alert severity="success">{passwordSuccess}</Alert>}

      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <TextField
          label="Current Password"
          type="password"
          variant="outlined"
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          variant="outlined"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button variant="contained" color="secondary" onClick={handleChangePassword}>
          CHANGE PASSWORD
        </Button>
        <Button
          color="secondary"
          fullWidth
          onClick={() => navigate("/profile")}
          style={{ marginTop: "10px" }}
        >
          Back to Profile
        </Button>
      </Box>
    </Container>
  );
}

export default Changepassword;