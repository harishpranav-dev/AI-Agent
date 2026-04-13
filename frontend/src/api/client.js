/**
 * module: client.js
 * purpose: Axios HTTP client for backend API communication.
 */

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 120000,
  headers: { "Content-Type": "application/json" },
});

export const runAgents = (goal, mode, clientId, customPrompts = {}) =>
  api.post("/api/run", {
    goal,
    mode,
    client_id: clientId,
    custom_prompts: customPrompts,
  });

export const getHistory = (sessionId) => api.get(`/api/history/${sessionId}`);

export const getTask = (taskId) => api.get(`/api/history/task/${taskId}`);

export const getSystemInfo = () => api.get("/api/info");

export default api;
