import { useState } from "react";

const TodoForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, completed: false });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Enter todo..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "8px", width: "250px" }}
      />
      <button type="submit" style={{ padding: "8px 12px", marginLeft: "10px" }}>
        Add
      </button>
    </form>
  );
};

export default TodoForm;
