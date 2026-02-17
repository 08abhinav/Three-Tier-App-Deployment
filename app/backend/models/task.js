import mongoose, { model, Schema } from "mongoose";

const taskSchema = new Schema({
    task:{
        type: String,
        required: true
    },
    status:{
        type: Boolean, 
        default: false
    }
})

const Task = model('task', taskSchema)
export default Task;
