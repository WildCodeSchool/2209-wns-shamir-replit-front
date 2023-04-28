import axios, { RawAxiosRequestHeaders } from "axios";

let fromFrontUrl = "http://localhost:5000";

if (process.env.REACT_APP_BACKEND_URL)
  fromFrontUrl = process.env.REACT_APP_BACKEND_URL;

export const api = () => {
  const token = localStorage.getItem("token");

  const headers: RawAxiosRequestHeaders = {};

  if (token) headers.Authorization = "Bearer " + token;

  return axios.create({
    baseURL: `${fromFrontUrl}/api`,
    headers,
    // withCredentials: true,
  });
};
