import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // blue
    },
    secondary: {
      main: "#10b981", // green
    },
    background: {
      default: "#f5f7fb",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

export default theme;