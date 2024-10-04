import axios from "axios";

const mainURL = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "https://medme.abdujabborov.uz/",
});

export default mainURL;
