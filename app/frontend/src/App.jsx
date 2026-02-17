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

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await getTodos();
    setTodos(res.data);
  };

  const handleAdd = async (todo) => {
    await createTodo(todo);
    fetchTodos();
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    fetchTodos();
  };

  const handleToggle = async (todo) => {
    await updateTodo(todo._id, {
      ...todo,
      completed: !todo.completed,
    });
    fetchTodos();
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>Todo App</h2>
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
