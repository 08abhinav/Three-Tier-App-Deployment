require("dotenv").config();
const tasks = require("./routes/tasks");
const connectDB = require("./db/dbConnection");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.json());
app.use(cors());

app.get('/ok', (req, res) => {
    res.status(200).send('ok')
  })

app.use("/api/tasks", tasks);

const port = process.env.PORT || 3500;
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
