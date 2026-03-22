import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        "& .MuiDrawer-paper": {
          width: 240,
          background: "#0f172a",
          color: "#fff",
        },
      }}
    >
      <List sx={{ mt: 8 }}>
        <ListItemButton
          selected={location.pathname === "/"}
          onClick={() => navigate("/")}
        >
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          selected={location.pathname === "/students"}
          onClick={() => navigate("/students")}
        >
          <ListItemText primary="Students" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}