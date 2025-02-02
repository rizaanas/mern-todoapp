// using express
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')

// create an instance of express
const app = express();
app.use(express.json())
app.use(cors())
// // define a route
// app.get("/",(req,res)=>{
//     res.send("salam , I'm riza!")
// })

// // sample in-memory storage for todo items
// let todos =[]


// connecting mongodb
mongoose.connect('mongodb://localhost:27017/todo-app')
.then(() =>{
    console.log('DB connected!');
}).catch((err)=>{
    console.log(err);
})

// creating schema
const todoSchema = new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:{
        required:true,
        type:String
    }
})

// creating model
const todoModel = mongoose.model('Todo',todoSchema)


// create a new todo items
app.post('/todos',async(req,res)=>{
    const {title,description} = req.body
    // const newTodo ={
    //     id:todos.length +1,
    //     title,
    //     description
    // }
    // todos.push(newTodo);
    // console.log(todos);

    try {
        const newTodo = new todoModel({title,description})
        await newTodo.save()
        res.status(201).json(newTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:error.messsage})   
    }
})

//  get all items 
app.get('/todos',async (req,res)=>{
    try {
        const todos = await todoModel.find()
        res.json(todos)
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:error.messsage})  
    }
})

//  update a todo items
app.put("/todos/:id", async (req,res)=>{
    try {
        const {title,description} = req.body
        const id = req.params.id
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title,description},
            {new:true}
        )
        if (!updatedTodo){
            return res.status(404).json({messsage:"Todo not found"})
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:error.messsage})
    }
})

// deleting items
app.delete("/todos/:id",async(req,res) =>{
    try {
        const id = req.params.id
        await todoModel.findByIdAndDelete(id)
        res.status(204).end()
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:error.messsage})
    }
})


// start the server
const port = 8000
app.listen(port,()=>{
    console.log("server is running " + port);
})
