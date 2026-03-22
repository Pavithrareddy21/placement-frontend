import { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        "https://placement-monitoring-backend-1.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", res.data); // 🔥 debug

      // ✅ handle all possible token formats
      const token =
        res.data.token || res.data.accessToken || res.data.jwt;

      if (!token) {
        alert("Invalid login response ❌");
        return;
      }

      // ✅ store token
      localStorage.setItem("token", token);

      alert("Login successful ✅");

      // ✅ redirect
      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(
        err.response?.data?.message ||
        "Login failed ❌"
      );
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
      }}
    >
      <Card sx={{ p: 3, borderRadius: 3, width: 350 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Login
          </Typography>

          <TextField
            fullWidth
            label="Email"
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button fullWidth variant="contained" onClick={login}>
            Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}