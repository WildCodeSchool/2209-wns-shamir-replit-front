import axios from "axios";

let fromFrontUrl = "http://localhost:5000";

if (process.env.BACKEND_URL) fromFrontUrl = process.env.BACKEND_URL;

export const api = axios.create({
  baseURL: `${fromFrontUrl}/api`,
  // withCredentials: true,
});
