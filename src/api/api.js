import axios_base from "axios";

export const axios = axios_base.create({
  withCredentials: true,
  baseURL: "http://localhost:3003",
});
