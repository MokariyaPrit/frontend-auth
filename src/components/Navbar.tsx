import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  isAuth: boolean;
  setAuth: (isAuth: boolean) => void;
}

export default function Navbar({ isAuth, setAuth }: NavbarProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuEl, setMobileMenuEl] = useState<null | HTMLElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const open = Boolean(anchorEl);
  const mobileOpen = Boolean(mobileMenuEl);

  useEffect(() => {
    const userEmail = sessionStorage.getItem("userEmail");
    if (userEmail) {
      const checkAdmin = async () => {
        try {
          const response = await fetch(`http://localhost:3000/user/role?email=${userEmail}`);
          const data = await response.json();
          if (response.ok && data.role === "admin") {
            setIsAdmin(true);
          }
        } catch (err) {
          console.error("Error checking admin role:", err);
        }
      };
      checkAdmin();
    }
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuEl(null);
  };

  const handleLogout = async () => {
    try {
      const email = sessionStorage.getItem("userEmail");
      if (email) {
        const response = await fetch("http://localhost:3000/user/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (response.ok) {
          sessionStorage.removeItem("userEmail");
          setAuth(false);
          navigate("/login");
        } else {
          console.error("Logout failed:", await response.text());
        }
      } else {
        setAuth(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      setAuth(false);
      navigate("/login");
    } finally {
      handleClose();
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="home"
          onClick={() => navigate("/homepage")}
          sx={{ mr: 2 }}
        >
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        {isAuth ? (
          <Box>
            <ThemeToggle />
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { handleClose(); navigate("/profile"); }}>Profile</MenuItem>
              
              <MenuItem onClick={() => { handleClose(); navigate("/changepassword"); }}>Change Password</MenuItem>
              {isAdmin && <MenuItem onClick={() => { handleClose(); navigate("/admin"); }}>Admin Dashboard</MenuItem>}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : isMobile ? (
          <Box>
            <IconButton size="large" color="inherit" onClick={handleMobileMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuEl}
              open={mobileOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={() => { handleClose(); navigate("/login"); }}>Login</MenuItem>
              <MenuItem onClick={() => { handleClose(); navigate("/signup"); }}>Signup</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
            <Button color="inherit" onClick={() => navigate("/signup")}>Signup</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}