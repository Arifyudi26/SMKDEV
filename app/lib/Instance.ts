import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

const Instance = axios.create({
  baseURL: BASE_URL,
});

export default Instance;
