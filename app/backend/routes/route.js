import express from 'express'
import Task from "../models/task.js"

const taskRoutes = express.Router()

taskRoutes.post('/', async (req, res)=>{
    try{
        const { task } = req.body;
        const data = await Task.create({
            task: task
        });

        return res.status(200).json(data)
    }catch(error){
        console.log(error);
        return res.status(500).json({status: "failed", message: error})
    }
})

taskRoutes.get("/", async (req, res)=>{
    try{
        const task = await Task.find().sort({ createdAt: -1 })
        return res.status(200).json(task)
    }catch(error){
        return res.status(500).json({status: "failed", message: error})
    }
})

taskRoutes.put("/:id", async (req, res)=>{
    try{
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id },
            req.body
        );
        return res.status(200).json(task)
    }catch(error){
        return res.status(500).json({status: "failed", message: error})
    }
})

taskRoutes.delete("/:id", async (req, res)=>{
    try{
        await Task.findOneAndDelete(
            { _id: req.params.id },
            req.body
        );
        return res.status(200).json({status: "success"})
    }catch(error){
        return res.status(500).json({status: "failed", message: error})
    }
})

export default taskRoutes;