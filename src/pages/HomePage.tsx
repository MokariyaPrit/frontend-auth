import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";

const HomePage = () => {
  const theme = useTheme();

  // Define accessible routes correctly
  const accessibleRoutes = [
    { path: "/Changepassword", label: "Change Password" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Dashboard
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {accessibleRoutes.map((route) => (
          <Grid container spacing={3} sx={{ justifyContent: "center" }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                elevation={4}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <CardActionArea component={Link} to={route.path} sx={{ height: "100%" }}>
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {route.label}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Navigate to {route.label} section.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
