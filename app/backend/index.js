import "dotenv/config"
import cors from 'cors'
import {setDB} from "./db/dbConnection.js"
import express from 'express'
import mysql from "mysql2/promise" 
import taskRoutes from "./routes/route.js"
import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm"

const app = express()
const REGION = process.env.AWS_REGION || "us-east-1";
const ssm = new SSMClient({ region: REGION });
let db;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/tasks", taskRoutes);


/* ------------------ FETCH DB CONFIG FROM SSM ------------------ */

async function getDBConfig() {
  const command = new GetParametersCommand({
    Names: [
      "/myapp/db/host",
      "/myapp/db/user",
      "/myapp/db/password",
      "/myapp/db/name"
    ],
    WithDecryption: true
  });

  const res = await ssm.send(command);
  const params = {};

  res.Parameters.forEach(p => {
    params[p.Name.split("/").pop()] = p.Value;
  });

  if (!params.host || !params.user || !params.password || !params.name) {
    throw new Error("Missing DB parameters in SSM");
  }

  return params;
}

/* ------------------ CREATE DATABASE IF NOT EXISTS ------------------ */

async function ensureDatabaseExists(config) {
  const conn = await mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${config.name}\``);
  await conn.end();
  console.log("✅ Database verified");
}

async function connectWithRetry(retries = 10, delay = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const cfg = await getDBConfig();

      await ensureDatabaseExists(cfg);

      const pool = mysql.createPool({
        host: cfg.host,
        user: cfg.user,
        password: cfg.password,
        database: cfg.name,
        connectionLimit: 10,
        ssl: { rejectUnauthorized: false }
      });

      console.log("✅ Connected to RDS");
      return pool;
    } catch (err) {
      console.error(`❌ DB connection failed (attempt ${i})`, err.message);
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

/* ------------------ TABLE CREATION ------------------ */

async function ensureTables(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      task VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Tables ready");
}

// ---- Health Check Routes ----
  // Basic health (for ALB target group)
  app.get('/health', (req, res) => {
    return res.status(200).json({
      status: 'ok',
      service: 'backend',
      uptime: process.uptime()
    });
  });

  // DB health (for debugging only)
  app.get('/health/db', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT 1 as db_up');

      return res.status(200).json({
        status: 'ok',
        database: 'connected',
        host: process.env.host,
        database_name: process.env.database,
        result: rows[0]
      });

    } catch (error) {
      console.error('DB health check failed:', error.message);

      return res.status(500).json({
        status: 'error',
        database: 'down',
        error: error.message
      });
    }
  });

app.get("/", (req, res)=>{
    return res.json({status: "success", message: " Hello from backend"})
})

(async()=>{
    try{
        db = await connectWithRetry();
        setDB(db);
        await ensureTables(db);
        const port = process.env.PORT || 8500

        app.listen(port, ()=> console.log(`App listening on: ${port}`))

    }catch(error){
        console.log("App failed: ", error)
    }
})();