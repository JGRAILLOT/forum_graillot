//Api.js

import axios from "axios";

const BASE_URL = "http://localhost:3000/api";
const api = axios.create({
  baseURL: BASE_URL,
});

export const makeRequest = async (method, url, data = null, params = null) => {
  try {
    const response = await api({
      method,
      url,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

export default makeRequest;
