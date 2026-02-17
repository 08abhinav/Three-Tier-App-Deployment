import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3500",
});

export const getTodos = () => API.get("/api/tasks");
export const createTodo = (data) => API.post("/api/tasks", data);
export const updateTodo = (id, data) => API.put(`/api/tasks/${id}`, data);
export const deleteTodo = (id) => API.delete(`/api/tasks/${id}`);
