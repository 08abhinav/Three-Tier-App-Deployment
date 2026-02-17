import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./api/todoAPI";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await getTodos();

      if (Array.isArray(res.data)) {
        setTodos(res.data);
      } else {
        setTodos([]);
      }

    } catch (err) {
      setError("Failed to fetch todos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (todo) => {
    try {
      const res = await createTodo(todo);

      setTodos((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete todo
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);

      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle completed
  const handleToggle = async (todo) => {
    try {
      const res = await updateTodo(todo._id, {
        ...todo,
        completed: !todo.completed,
      });

      setTodos((prev) =>
        prev.map((t) => (t._id === todo._id ? res.data : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <h2>Todo App</h2>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      <TodoForm onAdd={handleAdd} />

      <TodoList
        todos={todos}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  );
}

export default App;
