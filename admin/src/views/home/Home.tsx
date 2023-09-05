import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import LoginBannerSrc from "assets/images/login.jpg";
import { LoginForm } from "views/home/components";

export const Home = () => {
  return (
    <Card
      sx={{
        width: "85vw",
        margin: { xs: "20px auto", md: "40px auto" },
        "& .MuiCardContent-root": {
          paddingBottom: "0 !important",
        },
      }}
    >
      <CardContent sx={{ padding: 0 }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              sx={{
                objectFit: "cover",
                height: "100%",
                width: "100%",
                borderRadius: "5px",
              }}
              alt="The Blog Banner"
              src={LoginBannerSrc}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: { xs: "1rem", md: "4rem 0" },
              }}
            >
              <Typography
                component="h2"
                color="#1976d2"
                sx={{ fontSize: { xs: "32px", sm: "40px", md: "55px" } }}
              >
                Admin Login
              </Typography>
            </Box>
            <LoginForm />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
