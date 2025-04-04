// frontend-auth/src/pages/SignupPage.tsx
import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
import backgroundImage from "../assets/image.png"; // Import your background image

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Validation
    if (!firstName) {
      setError("First name is required.");
      return;
    }
    if (firstName.length < 2) {
      setError("First name must be at least 2 characters.");
      return;
    }
    if (!lastName) {
      setError("Last name is required.");
      return;
    }
    if (lastName.length < 2) {
      setError("Last name must be at least 2 characters.");
      return;
    }
    if (!mobileNo) {
      setError("Mobile number is required.");
      return;
    }
    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    // Mobile number validation (basic, adjust as needed)
    const mobileRegex = /^[0-9]{10}$/; // Assumes 10-digit mobile number
    if (!mobileRegex.test(mobileNo)) {
      setError("Invalid mobile number format. Must be 10 digits.");
      return;
    }

    // Password validation (basic, adjust as needed)
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          mobile_no: `+91${mobileNo}`,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("userEmail", email); // ✅ Store email for OTP verification

        alert("Signup successful! Please verify your email.");

        // ✅ Redirect to OTP verification page
        navigate("/otp-verification");
      } else {
        setError(data.message || "Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error); // ✅ Log for debugging
      setError("Something went wrong. Please check your network and try again.");
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            {/* <PersonAddIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
        </Box>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        <TextField
          fullWidth
          label="First Name"
          margin="normal"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Last Name"
          margin="normal"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Mobile No"
          margin="normal"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSignup}
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
        <Button
          color="secondary"
          fullWidth
          onClick={() => navigate("/login")}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Paper>
    </Box>
  );
}