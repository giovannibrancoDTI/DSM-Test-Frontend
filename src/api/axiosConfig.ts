import axios from "axios";

const BASE_URL_BFF = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: BASE_URL_BFF,
});

export { client };
