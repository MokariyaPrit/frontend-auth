import { useEffect, useState } from "react";
import { Button, TextField, Typography, Container, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [displayMobileNo, setDisplayMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [userStatus, setUserStatus] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userEmail = sessionStorage.getItem("userEmail");
      if (!userEmail) {
        setErrorMessage("User email not found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/user/profile?email=${userEmail}`);
        const data = await response.json();

        if (response.ok && data.user) {
          setFirstName(data.user.first_name);
          setLastName(data.user.last_name);
          setMobileNo(data.user.mobile_no);
          setDisplayMobileNo(data.user.mobile_no.slice(3));
          setEmail(data.user.email);
          setUserStatus(data.user.status);
          console.log(data.user);
        } else {
          setErrorMessage("Failed to fetch profile data.");
        }
      } catch (error) {
        setErrorMessage("Something went wrong. Try again.");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleUpdateProfile = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    // Validation
    if (!firstName) {
      setErrorMessage("First name is required.");
      return;
    }
    if (firstName.length < 2) {
      setErrorMessage("First name must be at least 2 characters.");
      return;
    }
    if (!lastName) {
      setErrorMessage("Last name is required.");
      return;
    }
    if (lastName.length < 2) {
      setErrorMessage("Last name must be at least 2 characters.");
      return;
    }
    if (!mobileNo) {
      setErrorMessage("Mobile number is required.");
      return;
    }
    if (mobileNo.slice(3).length !== 10) {
      setErrorMessage("Mobile number must be 10 digits.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/user/${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, first_name: firstName, last_name: lastName, mobile_no: mobileNo }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
      } else {
        setErrorMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Try again.");
    }
  };

  const handleResendOtp = async () => {
    setOtpMessage("");
    setErrorMessage("");

    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
      setErrorMessage("User email is missing. Try logging in again.");
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
        setOtpMessage(data.message);
        navigate("/otp-verification");
      } else {
        setErrorMessage(data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Try again.");
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 10 && /^\d*$/.test(value)) { // only allow numbers and max length 10
      setDisplayMobileNo(value);
      setMobileNo(`+91${value}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" textAlign="center" gutterBottom>
        Profile Page
      </Typography>

      <Box mt={2}>
        {userStatus === "ACTIVE" ? (
          <Typography variant="h6" color="green" textAlign="center">
            Status: Active
          </Typography>
        ) : userStatus === "INACTIVE" ? (
          <>
            <Typography variant="h6" color="orange" textAlign="center">
              Status: Inactive
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleResendOtp}
              style={{ marginTop: "10px" }}
            >
              Activate Account (Resend OTP)
            </Button>
          </>
        ) : (
          <Typography textAlign="center">Loading status...</Typography>
        )}
      </Box>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {otpMessage && <Alert severity="success">{otpMessage}</Alert>}

      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          label="Mobile No"
          variant="outlined"
          fullWidth
          value={displayMobileNo}
          onChange={handleMobileChange}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          disabled
        />
        <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
          UPDATE PROFILE
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;