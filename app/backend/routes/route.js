import express from 'express'
import { getDB } from "../db/dbConnection.js"

const taskRoutes = express.Router()

/* CREATE */
taskRoutes.post('/', async (req, res) => {
  try {
    const { task } = req.body;
    const db = getDB();

    const [result] = await db.query(
      "INSERT INTO tasks (task) VALUES (?)",
      [task]
    );

    return res.status(201).json({
      id: result.insertId,
      task
    });

  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
});

/* READ */
taskRoutes.get("/", async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );

    return res.status(200).json(rows);

  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
});

/* UPDATE */
taskRoutes.put("/:id", async (req, res) => {
  try {
    const { task } = req.body;
    const db = getDB();

    await db.query(
      "UPDATE tasks SET task = ? WHERE id = ?",
      [task, req.params.id]
    );

    return res.status(200).json({ status: "updated" });

  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
});

/* DELETE */
taskRoutes.delete("/:id", async (req, res) => {
  try {
    const db = getDB();

    await db.query(
      "DELETE FROM tasks WHERE id = ?",
      [req.params.id]
    );

    return res.status(200).json({ status: "deleted" });

  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
});

export default taskRoutes;
