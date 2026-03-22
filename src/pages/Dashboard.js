import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid } from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const API = "https://placement-monitoring-backend-1.onrender.com/api/students";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchStudents();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API, {
        headers: getAuthHeaders(),
      });

      console.log("Dashboard Data:", res.data); // debug

      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    }
  };

  // 🚨 Prevent crash
  if (!students) return <h2>Loading...</h2>;

  const total = students.length;
  const placed = students.filter((s) => s.placed).length;
  const notPlaced = total - placed;

  const pieData = [
    { name: "Placed", value: placed || 0 },
    { name: "Not Placed", value: notPlaced || 0 },
  ];

  const COLORS = ["#4caf50", "#f44336"];

  // CGPA buckets
  const cgpaBuckets = {
    "6-7": 0,
    "7-8": 0,
    "8-9": 0,
    "9+": 0,
  };

  students.forEach((s) => {
    const cgpa = Number(s.cgpa);
    if (isNaN(cgpa)) return;

    if (cgpa < 7) cgpaBuckets["6-7"]++;
    else if (cgpa < 8) cgpaBuckets["7-8"]++;
    else if (cgpa < 9) cgpaBuckets["8-9"]++;
    else cgpaBuckets["9+"]++;
  });

  const barData = Object.keys(cgpaBuckets).map((key) => ({
    range: key,
    students: cgpaBuckets[key],
  }));

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {/* 🔥 CARDS */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Students</Typography>
            <Typography variant="h3">{total}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: "#e8f5e9" }}>
          <CardContent>
            <Typography variant="h6">Placed</Typography>
            <Typography variant="h3" color="green">
              {placed}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: "#ffebee" }}>
          <CardContent>
            <Typography variant="h6">Not Placed</Typography>
            <Typography variant="h3" color="red">
              {notPlaced}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* 🔥 PIE CHART */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Placement Status</Typography>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* 🔥 BAR CHART */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">CGPA Distribution</Typography>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {error && (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      )}
    </Grid>
  );
}