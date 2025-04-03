import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import SalesList from "./pages/SalesList";
import SalesForm from "./pages/SalesForm";
import SalesDetail from "./pages/SalesDetail";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";
import "./App.css";

// Brutalist theme
const theme = createTheme({
  palette: {
    mode: "light", // Keep light mode for high contrast
    primary: {
      main: "#000000",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FFFF00", // Bright yellow accent
      contrastText: "#000000",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000000",
      secondary: "#444444",
    },
    error: {
      main: "#FF0000",
    },
    success: {
      main: "#00FF00",
      contrastText: "#000000",
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: ["Lato", "Arial", "sans-serif"].join(","),
    fontWeightRegular: 400,
    fontWeightMedium: 700,
    fontWeightBold: 900,
    h1: { fontWeight: 900, textTransform: "uppercase" },
    h2: { fontWeight: 900, textTransform: "uppercase" },
    h3: { fontWeight: 900, textTransform: "uppercase" },
    h4: { fontWeight: 900, textTransform: "uppercase" },
    h5: { fontWeight: 900, textTransform: "uppercase" },
    h6: { fontWeight: 700 },
    button: {
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#FFFFFF",
          color: "#000000",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: "static",
      },
      styleOverrides: {
        root: {
          backgroundColor: "#000000",
          color: "#FFFFFF",
          borderBottom: "2px solid #000000",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          border: "2px solid #000000",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: "contained",
      },
      styleOverrides: {
        root: {
          border: "2px solid #000000",
          padding: "8px 20px",
          boxShadow: "4px 4px 0px #000000",
          transition: "transform 0.1s ease-in-out, boxShadow 0.1s ease-in-out",
          "&:active": {
            transform: "translate(2px, 2px)",
            boxShadow: "2px 2px 0px #000000",
          },
        },
        containedPrimary: {
          backgroundColor: "#000000",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#333333",
          },
        },
        containedSecondary: {
          backgroundColor: "#FFFF00",
          color: "#000000",
          border: "2px solid #000000",
          "&:hover": {
            backgroundColor: "#dddd00",
          },
        },
        outlinedPrimary: {
          border: "2px solid #000000",
          color: "#000000",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            border: "2px solid #000000",
          },
        },
        containedSuccess: {
          backgroundColor: "#00FF00",
          color: "#000000",
          border: "2px solid #000000",
          "&:hover": {
            backgroundColor: "#00cc00",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderWidth: "2px",
              borderColor: "#000000",
            },
            "&:hover fieldset": {
              borderColor: "#555555",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#000000",
              borderWidth: "2px",
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 700,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          border: "2px solid #000000",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: "1px solid #000000",
          padding: "10px",
          fontWeight: "inherit",
        },
        head: {
          fontWeight: 900,
          backgroundColor: "#dddddd",
          borderBottom: "2px solid #000000",
          textTransform: "uppercase",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          border: "2px solid transparent",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            border: "2px solid #000000",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "24px",
          paddingRight: "24px",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Remove BrowserRouter since it's now in main.jsx */}
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: "#dddddd",
            color: "#000000",
            borderBottom: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          <Toolbar>
            <a
              href="/react-crud-test"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="logo"
                sx={{ mr: 2 }}
              >
                <BoltIcon />
              </IconButton>
            </a>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              Faktur Digital App
            </Typography>
          </Toolbar>
        </AppBar>

        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Routes>
            <Route path="/" element={<SalesList />} />
            <Route path="/add" element={<SalesForm />} />
            <Route path="/edit/:id" element={<SalesForm />} />
            <Route path="/detail/:id" element={<SalesDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>

        <Box
          component="footer"
          sx={{
            py: 2,
            mt: "auto",
            backgroundColor: "#dddddd",
            color: "#000000",
            borderTop: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ px: { xs: 2, sm: 3 } }}
          >
            <Grid
              item
              xs={12}
              md={4}
              sx={{ textAlign: { xs: "center", md: "right" } }}
            >
              <Typography variant="body2">
                &copy; {new Date().getFullYear()} All Rights Reserved.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* Remove closing BrowserRouter tag */}
    </ThemeProvider>
  );
}

export default App;
