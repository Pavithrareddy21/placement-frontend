import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Students from "./pages/Students";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material";
import { useState } from "react";

function App() {
  const [darkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          
        {/* 🔹 LOGIN PAGE (no sidebar/navbar) */}
        <Route path="/login" element={<Login />} />

        {/* 🔹 PROTECTED ROUTES */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Sidebar />

                <Box sx={{ display: "flex" }}>
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      ml: "240px",
                      p: 3,
                    }}
                  >
                    <Toolbar /> {/* pushes content below navbar */}

                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/students" element={<Students />} />
                    </Routes>
                  </Box>
                </Box>
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;