import { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Chip,
} from "@mui/material";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    passoutYear: "",
    cgpa: "",
    skills: "",
    placed: false,
  });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const API = "http://65.2.79.152:8080/api/students";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API, {
        headers: getAuthHeaders(),
      });
      setStudents(res.data);
    } catch (err) {
      setError("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      college: "",
      branch: "",
      passoutYear: "",
      cgpa: "",
      skills: "",
      placed: false,
    });
  };

  const addStudent = async () => {
    try {
      const payload = {
        ...form,
        passoutYear: form.passoutYear ? Number(form.passoutYear) : null,
        cgpa: form.cgpa ? Number(form.cgpa) : null,
        placementStatus: form.placed ? "PLACED" : "NOT_PLACED",
      };

      await axios.post(API, payload, {
        headers: getAuthHeaders(),
      });

      setSuccess("Student added successfully");
      resetForm();
      fetchStudents();
    } catch (err) {
      if (err.response?.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : JSON.stringify(err.response.data)
        );
      } else {
        setError("Add failed");
      }
    }
  };

  const handleEdit = (student) => {
    setForm({
      ...student,
      passoutYear: student.passoutYear ?? "",
      cgpa: student.cgpa ?? "",
      placed: !!student.placed,
    });
    setOpenEdit(true);
  };

  const updateStudent = async () => {
  try {
    const payload = {
      ...form,
      passoutYear: form.passoutYear ? Number(form.passoutYear) : null,
      cgpa: form.cgpa ? Number(form.cgpa) : null,

      // 🔥 IMPORTANT
      placed: form.placed,
      placementStatus: form.placed ? "PLACED" : "NOT_PLACED",
    };

    console.log("UPDATE PAYLOAD:", payload); // debug

    await axios.put(`${API}/${form.id}`, payload, {
      headers: getAuthHeaders(),
    });

    setSuccess("Student updated successfully");
    setOpenEdit(false);
    resetForm();
    fetchStudents();
  } catch (err) {
    setError("Update failed");
  }
};
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/${selectedId}`, {
        headers: getAuthHeaders(),
      });

      setSuccess("Student deleted successfully");
      setOpenDelete(false);
      setSelectedId(null);
      fetchStudents();
    } catch (err) {
      setError("Delete failed");
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.college?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterStatus === "ALL" ||
      (filterStatus === "PLACED" && s.placed) ||
      (filterStatus === "NOT_PLACED" && !s.placed);

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Card sx={{ mb: 4, borderRadius: 4, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            Add Student
          </Typography>

          <Grid container spacing={3}>
            {[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              { key: "college", label: "College" },
              { key: "branch", label: "Branch" },
              { key: "passoutYear", label: "Passout Year" },
              { key: "cgpa", label: "CGPA" },
              { key: "skills", label: "Skills" },
            ].map((field) => (
              <Grid item xs={12} sm={6} md={4} key={field.key}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.key}
                  value={form[field.key] || ""}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="placed"
                    checked={!!form.placed}
                    onChange={handleChange}
                  />
                }
                label="Placed"
              />
            </Grid>
          </Grid>

          <Button sx={{ mt: 3 }} variant="contained" onClick={addStudent}>
            Add Student
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search by name, email, or college..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Filter by Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="ALL">All</option>
                <option value="PLACED">Placed</option>
                <option value="NOT_PLACED">Not Placed</option>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            Students List
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>College</b></TableCell>
                <TableCell><b>CGPA</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.college}</TableCell>
                  <TableCell>{s.cgpa}</TableCell>
                  <TableCell>
                    {s.placed ? (
                      <Chip label="Placed" color="success" />
                    ) : (
                      <Chip label="Not Placed" color="error" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(s)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(s.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              { key: "college", label: "College" },
              { key: "branch", label: "Branch" },
              { key: "passoutYear", label: "Passout Year" },
              { key: "cgpa", label: "CGPA" },
              { key: "skills", label: "Skills" },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.key}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.key}
                  value={form[field.key] || ""}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="placed"
                    checked={!!form.placed}
                    onChange={handleChange}
                  />
                }
                label="Placed"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={updateStudent}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this student?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess("")}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </>
  );
}