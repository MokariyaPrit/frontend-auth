import { useState } from "react";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SignupIllustration from "../components/SignupIllustration"; // Import the illustration component

export default function SignupPage() {
  const [first_name, setfirst_name] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Validation
    if (!first_name) {
      setError("Full name is required.");
      return;
    }
    if (first_name.length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }
    if (!lastname) {
      setError("Organization name is required.");
      return;
    }
    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!mobileNo) {
      setError("Mobile number is required.");
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

    // Mobile number validation (basic, assumes 10-digit mobile number)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNo)) {
      setError("Invalid mobile number format. Must be 10 digits.");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first_name.split(" ")[0] || "",
          last_name:  lastname.split(" ")[0] || "",
          mobile_no: `+91${mobileNo}`,
          email,
          password,
          userName:username,
          role:'user'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("userEmail", email);
        alert("Signup successful! Please verify your email.");
        navigate("/otp-verification");
      } else {
        setError(data.message || "Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError(
        "Something went wrong. Please check your network and try again."
      );
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
      {/* Left Side: Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 3, md: 5 }, // Increased padding
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ maxWidth: 600, width: "100%" }}>
          {" "}
          {/* Increased maxWidth from 500 to 600 */}
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Create Account
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Create a great platform for managing your cases & clients
          </Typography>
          {error && (
            <Typography color="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            {" "}
            {/* Increased gap */}
            <TextField
              fullWidth
              label="first Name *"
              value={first_name}
              onChange={(e) => setfirst_name(e.target.value)}
              variant="outlined"
              size="medium"
            />
            <TextField
              fullWidth
              label="Last Name *"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              variant="outlined"
              size="medium"
            />
          </Box>
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            <TextField
              fullWidth
              label="User name *"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              variant="outlined"
              size="medium"
            />
            <TextField
              fullWidth
              label="Mobile Number *"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              variant="outlined"
              size="medium"
            />
          </Box>
          <TextField
            fullWidth
            label="Email Address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{ mb: 4 }}
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
            onClick={handleSignup}
            sx={{ py: 1.5, fontSize: "1.1rem", mb: 3 }}
          >
            Sign Up
          </Button>
          <Typography variant="body2" align="center">
            Already a member?{" "}
            <Link
              component="button"
              onClick={() => navigate("/login")}
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
      {/* // Right Side: Illustration */}
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
    </Box>
  );
}
