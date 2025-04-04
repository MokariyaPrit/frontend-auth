import { createTheme } from "@mui/material/styles";

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Default MUI primary blue (used in your AppBar)
      light: "#4791db",
      dark: "#115293",
      contrastText: "#fff", // White text for contrast
    },
    secondary: {
      main: "#d32f2f", // A red shade for secondary actions
      light: "#f44336",
      dark: "#b71c1c",
      contrastText: "#fff",
    },
    background: {
      default: "#f5f5f5", // Light gray from your App layout
      paper: "#fff", // White for cards, dialogs, etc.
    },
    text: {
      primary: "#333", // Dark gray for readability
      secondary: "#666",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Default MUI font
    h6: {
      fontWeight: 600, // Bold for Navbar title
    },
    button: {
      textTransform: "none", // No uppercase for buttons
      fontWeight: 500,
    },
  },
  spacing: 8, // Default MUI spacing unit (8px)
  components: {
    // Override default component styles
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Subtle shadow
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded buttons
          padding: "8px 16px",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 4, // Rounded dropdown menu
        },
      },
    },
  },
});

export default theme;