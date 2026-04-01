import axios from "axios";

const API = axios.create({
  baseURL: "https://digital-assgiment.onrender.com/api",
});

export default API;