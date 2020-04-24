import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:4000",
  // withCredentials: true,
  headers: {
    Authorization: JSON.parse(localStorage.getItem("token"))
  }
});