import axios from "axios";

const API = axios.create({
  baseURL: "http://65.2.79.152:8080/api",
});

// ✅ VERY IMPORTANT (THIS FIXES 403)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token); // debug

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;