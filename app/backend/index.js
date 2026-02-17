import "dotenv/config"
import express from 'express'
import cors from 'cors'
import {connectDB} from "./db/dbConnection.js"
import taskRoutes from "./routes/route.js"

const app = express()

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res)=>{
    return res.json({status: "success", message: " Hello from backend"})
})

const port = process.env.PORT || 8500
const start = async ()=>{
    try{
        await connectDB();
        app.listen(port, ()=> {
            console.log(`App listening on port: ${port}`)
        })
    }catch(error){
        console.log(error)
    }
}

start()