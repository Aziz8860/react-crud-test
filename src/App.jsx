import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import SalesList from "./pages/SalesList";
import SalesForm from "./pages/SalesForm";
import SalesDetail from "./pages/SalesDetail";
import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "./App.css";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: ["Lato", "Arial", "sans-serif"].join(","),
    h6: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Sales Management App
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
              py: 3,
              px: 2,
              mt: "auto",
              backgroundColor: (theme) => theme.palette.grey[200],
            }}
          >
            <Container maxWidth="sm">
              <Typography variant="body2" color="text.secondary" align="center">
                &copy; 2025 Sales Management App
              </Typography>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
